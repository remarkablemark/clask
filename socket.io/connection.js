'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const Message = require('../models/message');

/**
 * Handle client 'connection' event.
 *
 * @param {Object} socket - The socket.
 */
function onConnection(socket) {
    const { request } = socket;
    debug('client connected', request.session);

    if (request.session.isAuthenticated) {
        socket.on('chat:message', (chatMessage) => {
            debug('[chat:message]', chatMessage);
            socket.broadcast.emit('chat:message', chatMessage);
            socket.emit('chat:message', chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });
    } else {
        socket.emit('user:auth', false);
    }

    socket.on('disconnect', () => {
        debug('client disconnected', request.session);
    });
}

module.exports = onConnection;
