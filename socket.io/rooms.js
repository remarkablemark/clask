'use strict';

/**
 * Module dependencies.
 */
const helpers = require('./helpers');
const { addUserRoom } = helpers;
const debug = {
    db: require('../db/helpers').debug,
    socket: helpers.debug
};

// mongoose
const Room = require('../models/room');
const User = require('../models/user');

// constants
const {
    FIND_OR_CREATE_ROOM,
    NEW_ROOM,
    ROOMS,
    USER
}  = require('./events');

const roomProjection = { _users: 1, name: 1 };
const userOptions = { new: true };

/**
 * Event listeners for rooms.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function rooms(io, socket) {
    /**
     * Create new room.
     */
    socket.on(NEW_ROOM, (roomData) => {
        new Room(roomData).save((err, room) => {
            if (err) return debug.db('failed to save room', err);
            const roomId = room._id;

            // join room
            socket.join(roomId);
            addUserRoom(roomData._creator, roomId);

            // reformat before emitting new room to all clients
            io.emit(ROOMS, {
                [roomId]: {
                    _users: room._users,
                    name: room.name
                }
            });
            debug.socket(NEW_ROOM, room);

            // send user success or failure message
            socket.emit(NEW_ROOM, {
                success: true,
                message: 'New channel created.'
            });

            // update user
            User.findByIdAndUpdate(socket.userId, {
                $push: {
                    'rooms.sidebar.channels': roomId
                },
                $set: {
                    'rooms.active': roomId
                }
            }, userOptions, (err, user) => {
                if (err) return debug.db('failed to update user', err);
                debug.socket('user rooms', user);

                // update user rooms
                socket.emit(USER, {
                    rooms: user.rooms
                });
                debug.socket(USER, user.rooms);
            });
        });
    });

    /**
     * Find or create room.
     */
    socket.on(FIND_OR_CREATE_ROOM, (data) => {
        if (!data || data.constructor !== Object) return;
        const { _creator, _users } = data;
        if (!_creator && !_users) return;

        Room.findOne({
            _users,
            name: { $exists: false }
        }, roomProjection, (err, room) => {
            if (err) return debug.db('unable to find room', err);

            // room found
            if (room) {
                const roomId = room._id;

                // join room
                socket.join(roomId);
                addUserRoom(_creator, roomId);

                // send room and have client update its data
                socket.emit(ROOMS, {
                    [roomId]: { _users: room._users }
                });
                debug.socket(ROOMS, {
                    [roomId]: { _users: room._users }
                });

                // update user's sidebar
                User.findByIdAndUpdate(_creator, {
                    $set: {
                        'rooms.active': roomId
                    },
                    $push: {
                        'rooms.sidebar.directMessages': roomId
                    }
                }, userOptions, (err, user) => {
                    if (err) return debug.db('failed to update user', err);

                    // have creator update its user data
                    socket.emit(USER, { rooms: user.rooms });
                    debug.socket(USER, { rooms: user.rooms });
                });

                return;
            }

            // room not found so create new room
            new Room({ _users }).save((err, room) => {
                if (err) return debug.db('unable to create new room', err);

                const roomId = room._id;
                const roomUsers = room._users;

                // join room
                socket.join(roomId);
                addUserRoom(_creator, roomId);

                // send new room data to client
                socket.emit(ROOMS, {
                    [roomId]: { _users: roomUsers }
                });
                debug.socket(ROOMS, {
                    [roomId]: { _users: roomUsers }
                });

                User.findByIdAndUpdate(_creator, {
                    $set: {
                        'rooms.active': roomId
                    },
                    $push: {
                        'rooms.sidebar.directMessages': roomId
                    }
                }, userOptions, (err, user) => {
                    if (err) return debug.db('unable to update user', err);

                    // emit to creator updated rooms data
                    socket.emit(USER, { rooms: user.rooms });
                    debug.socket(USER, { rooms: user.rooms });
                });
            });
        });
    });
}

module.exports = rooms;
