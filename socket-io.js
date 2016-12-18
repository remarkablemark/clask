'use strict';

/**
 * Module dependencies.
 */
const socket = require('socket.io');
const packageName = require('./package').name;
const debug = require('debug')(packageName + ':socket');

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

        socket.on('chat:message', (message) => {
            debug('[chat:message]', message);
            io.emit('chat:message', message);
        });

        socket.on('disconnect', () => {
            debug('client disconnected');
        });
    });
}

module.exports = io;
