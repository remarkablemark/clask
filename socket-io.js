'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const socket = require('socket.io');
const session = require('./session');
const Message = require('./models/message');

/**
 * Socket.IO factory.
 *
 * @param {Object} server - The server.
 */
function io(server) {
    const io = socket(server);

    // use session middleware
    io.use((socket, next) => {
        session(socket.request, socket.request.res, next);
    });

    // client connected
    io.on('connection', (socket) => {
        const { request } = socket;
        debug('client connected', request.session);

        socket.on('chat:message', (chatMessage) => {
            debug('[chat:message]', chatMessage);
            io.emit('chat:message', chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });

        socket.on('disconnect', () => {
            debug('client disconnected', request.session);
        });
    });
}

module.exports = io;
