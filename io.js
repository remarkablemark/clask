'use strict';

/**
 * Module dependencies.
 */
const socket = require('socket.io');
const debug = require('debug')('express-template:socket');

/**
 * Socket.IO middleware.
 *
 * @param {Object} server - The server.
 */
function io(server) {
    const io = socket(server);

    // client connected
    io.on('connection', (socket) => {
        debug('[status]', 'connected');

        socket.on('chat:message', (message) => {
            debug('[chat:message]', message);
            io.emit('chat:message', message);
        });

        socket.on('disconnect', () => {
            debug('[status]', 'disconnected');
        });
    });
}

module.exports = io;
