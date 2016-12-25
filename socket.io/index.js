'use strict';

/**
 * Module dependencies.
 */
const socket = require('socket.io');
const session = require('../middleware/session');
const onConnection = require('./connection');

/**
 * Socket.IO server middleware.
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
    io.on('connection', onConnection.bind(null, io));
}

module.exports = io;
