'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const socket = require('socket.io');
const Message = require('./models/message');

/**
 * Socket.IO middleware.
 *
 * @param {Object} server - The server.
 */
function io(server) {
    const io = socket(server);

    // client connected
    io.on('connection', (socket) => {
        debug('client connected');

        socket.on('chat:message', (chatMessage) => {
            debug('[chat:message]', chatMessage);
            io.emit('chat:message', chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });

        socket.on('disconnect', () => {
            debug('client disconnected');
        });
    });
}

module.exports = io;
