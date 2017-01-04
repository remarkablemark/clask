'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('./helpers');

// socket events
const { USER } = require('./events');
const connect = require('./connect');
const disconnect = require('./disconnect');
const messages = require('./messages');

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

    // event listeners for messages
    messages(io, socket);

    // handle disconnect event
    disconnect(socket);
}

module.exports = connection;
