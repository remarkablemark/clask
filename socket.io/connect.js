'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const { reformatUsers } = require('../routes/helpers');

// socket events
const {
    MESSAGE,
    USER,
    USERS
} = require('./events');

// mongoose
const Message = require('../models/message');
const User = require('../models/user');

/**
 * Initial actions when client connects.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function connect(io, socket) {
    // find user based on _id
    User.findOne({
        _id: socket.userId
    }, {
        __v: 0,
        password: 0
    }, (error, user) => {
        if (error) return debug('unable to find user', error);
        if (!user) return debug('user _id invalid', socket.userId);

        const userData = user.toObject();
        userData.isAuthenticated = true;

        // send client user data
        socket.emit(USER, userData);

        // find messages based on user's last active room
        Message.find({
            room_id: user.rooms.active
        }, {
            __v: 0
        }, (error, messages) => {
            if (error) return debug('unable to find messages', error);
            if (!messages) return debug('room _id invalid', user.rooms.active);

            // send client latest messages
            socket.emit(MESSAGE, messages);
        });
    });

    // get all user _id and usernames
    User.find({}, {
        username: 1
    }, (error, users) => {
        if (error || !users) return debug('no users found', error);

        // reformat users
        let usersData = reformatUsers(users);
        Object.keys(io.sockets.connected).map((socketId) => {
            usersData[io.sockets.connected[socketId].userId].isConnected = true;
        });

        // send client data of all connected users
        socket.emit(USERS, usersData);
    });

    // broadcast to other clients that user has connected
    socket.broadcast.emit(USERS, {
        [socket.userId]: {
            username: socket.username,
            isConnected: true
        }
    });
}

module.exports = connect;
