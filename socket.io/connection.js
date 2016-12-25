'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const Message = require('../models/message');
const {
    CHAT_MESSAGE,
    USER_AUTH
} = require('./events');

/**
 * Handle client 'connection' event.
 *
 * @param {Object} socket - The socket.
 */
function onConnection(socket) {
    const { request } = socket;
    debug('client connected', request.session);

    if (request.session.isAuthenticated) {
        socket.on(CHAT_MESSAGE, (chatMessage) => {
            debug(CHAT_MESSAGE, chatMessage);
            socket.broadcast.emit(CHAT_MESSAGE, chatMessage);
            socket.emit(CHAT_MESSAGE, chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });

    } else {
        socket.emit(USER_AUTH, false);
    }

    socket.on('disconnect', () => {
        debug('client disconnected', request.session);
    });
}

module.exports = onConnection;
