'use strict';

/**
 * Module dependencies.
 */
const { USERS } = require('./events');

/**
 * Initial actions when client connects.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function connect(io, socket) {
    // send client object of connected users
    let connectedUsers = {};
    Object.keys(io.sockets.connected).map(socketId => {
        const socket = io.sockets.connected[socketId];
        connectedUsers[socket.userId] = {
            username: socket.username,
            isConnected: true
        };
    });
    socket.emit(USERS, connectedUsers);

    // broadcast to other clients that user has connected
    socket.broadcast.emit(USERS, {
        [socket.userId]: {
            username: socket.username,
            isConnected: true
        }
    });
}

module.exports = connect;
