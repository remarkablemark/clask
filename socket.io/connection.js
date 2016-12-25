'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const Message = require('../models/message');
const {
    CHAT_MESSAGE,
    USER_DATA
} = require('./events');

/**
 * Handle client 'connection' event.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function onConnection(io, socket) {
    const { request } = socket;
    debug('client connected', request.session);

    if (request.session.isAuthenticated) {
        // chat message
        socket.on(CHAT_MESSAGE, (chatMessage) => {
            debug(CHAT_MESSAGE, chatMessage);
            io.emit(CHAT_MESSAGE, chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });

    } else {
        // force client to disconnect if unauthenticated
        socket.emit(USER_DATA, {
            isAuthenticated: false
        });
    }

    socket.on('disconnect', () => {
        debug('client disconnected', request.session);
    });
}

module.exports = onConnection;
