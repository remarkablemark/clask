'use strict';

/**
 * Module dependencies.
 */
const debug = require('../db/helpers').debug;
const { reformatUsers } = require('./helpers');

// models
const Message = require('../models/message');
const User = require('../models/user');

// constants
const {
    MESSAGES,
    USER,
    USERS
} = require('./events');

const userProjection = { __v: 0, password: 0 };
const messageProjection = { __v: 0 };
const messageOptions = {
    limit: require('../config/constants').messagesLimit,
    sort: { created: -1 }
};
const emptyQuery = {};
const usersProjection = { username: 1 };

/**
 * Initial actions when client connects.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function connect(io, socket) {
    const { userId } = socket;

    // broadcast to other clients that user has connected
    socket.broadcast.emit(USERS, {
        [userId]: {
            username: socket.username,
            isConnected: true
        }
    });

    /**
     * Find user.
     */
    User.findById(userId, userProjection, (err, user) => {
        if (err) return debug('unable to find user', err);

        // user not found
        if (!user) return socket.emit(USER, { isAuthenticated: false });

        // send client user data
        socket.emit(USER, Object.assign(user.toObject(), {
            isAuthenticated: true
        }));

        /**
         * Find messages.
         */
        Message.find({
            _room: user.rooms.active
        }, messageProjection, messageOptions, (err, messages) => {
            if (err) return debug('unable to find messages', err);

            // no messages found
            if (!messages) return socket.emit(MESSAGES, []);

            // send client latest messages
            socket.emit(MESSAGES, messages.reverse());
        });
    });

    /**
     * Find all users.
     */
    User.find(emptyQuery, usersProjection, (err, users) => {
        if (err || !users) return debug('no users found', err);

        // mark connected user
        let usersData = reformatUsers(users);
        Object.keys(io.sockets.connected).map((socketId) => {
            usersData[io.sockets.connected[socketId].userId].isConnected = true;
        });

        // send client data of all users
        socket.emit(USERS, usersData);
    });
}

module.exports = connect;
