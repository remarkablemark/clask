'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('./helpers');
const socket = require('socket.io');
const session = require('../middleware/session');

// socket events
const { USER } = require('./events');
const connect = require('./connect');
const disconnect = require('./disconnect');
const messages = require('./messages');
const rooms = require('./rooms');

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
    io.on('connection', (socket) => {
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

        // set up event listeners for messages
        messages(io, socket);

        // set up event listeners for rooms
        rooms(io, socket);

        // handle disconnect event
        disconnect(socket);
    });
}

module.exports = io;
