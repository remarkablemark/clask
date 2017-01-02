'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');

// mongoose
const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../models/message');

// socket events
const {
    MESSAGE,
    USER,
    USERS
} = require('./events');
const connect = require('./connect');

/**
 * Handle client 'connection' event.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function connection(io, socket) {
    const { request } = socket;
    debug('client connected', request.session);

    // force client to disconnect if unauthenticated
    if (!request.session.isAuthenticated) {
        return socket.emit(USER, {
            isAuthenticated: false
        });
    }

    // save user id on socket
    socket.userId = request.session._id;
    socket.username = request.session.username;

    // perform initial actions on connect
    connect(io, socket);

    // chat message
    socket.on(MESSAGE, (message) => {
        message._id = ObjectId();
        io.emit(MESSAGE, message);

        // save to database
        const msg = new Message(message);
        msg.save((error) => {
            if (error) debug('failed to save message', error);
        });
        debug(MESSAGE, message);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit(USERS, {
            [socket.userId]: {
                isConnected: false
            }
        });
        Object.keys(socket._events).forEach(eventName => {
            socket.removeAllListeners(eventName);
        });
        debug('client disconnected', request.session);
    });
}

module.exports = connection;
