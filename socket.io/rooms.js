'use strict';

/**
 * Module dependencies.
 */
const debug = {};
debug.db = require('../db/helpers').debug;
debug.socket = require('./helpers').debug;

// mongoose
const Room = require('../models/room');
const User = require('../models/user');

// constants
const {
    NEW_ROOM,
    ROOMS,
    USER
}  = require('./events');

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
    socket.on(NEW_ROOM, (data) => {
        // save to database
        new Room(data).save((err, room) => {
            if (err) return debug.db('failed to save room', err);
            const roomId = room._id;

            // reformat before emitting new room to all clients
            io.emit(ROOMS, {
                [roomId]: {
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
                    'rooms.joined': roomId,
                    'rooms.sidebar.channels': roomId
                },
                $set: {
                    'rooms.active': roomId
                }
            }, { new: true }, (err, user) => {
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
}

module.exports = rooms;
