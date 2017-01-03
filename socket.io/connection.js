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
    MESSAGES,
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

    // chat messages
    socket.on(MESSAGES, (messages) => {
        messages[0]._id = ObjectId();
        io.emit(MESSAGES, messages);

        // save to database
        const message = new Message(messages[0]);
        message.save((error) => {
            if (error) debug('failed to save message', error);
        });
        debug(MESSAGES, messages);
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
