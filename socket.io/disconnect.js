'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('./helpers');
const { USERS } = require('./events');

/**
 * Actions when socket disconnects.
 *
 * @param {Object} socket - The socket.
 */
function disconnect(socket) {
    socket.on('disconnect', () => {
        // broadcast to other clients that user has disconnected
        socket.broadcast.emit(USERS, {
            [socket.userId]: {
                isConnected: false
            }
        });

        // remove all socket event listeners
        Object.keys(socket._events).forEach((eventName) => {
            socket.removeAllListeners(eventName);
        });

        debug('client disconnected', socket.request.session);
    });
}

module.exports = disconnect;
