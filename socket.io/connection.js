'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':socket');
const Message = require('../models/message');
const {
    CHAT_MESSAGE,
    USER_DATA,
    CONNECTED_USERS
} = require('./events');

/**
 * Handle client 'connection' event.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function onConnection(io, socket) {
    const { request } = socket;
    debug('client connected', request.session);

    if (request.session.isAuthenticated) {
        // save user id on socket
        const { _id } = request.session;
        socket._id = _id;

        // send client an array of all user ids that are connected
        // duplicates are possible for a user connected on multiple sockets
        socket.emit(
            CONNECTED_USERS,
            Object.keys(io.sockets.connected).map((id) => {
                return io.sockets.connected[id]._id;
            })
        );

        // broadcast to other clients that new user has joined
        socket.broadcast.emit(CONNECTED_USERS, [_id]);

        // chat message
        socket.on(CHAT_MESSAGE, (chatMessage) => {
            debug(CHAT_MESSAGE, chatMessage);
            io.emit(CHAT_MESSAGE, chatMessage);
            const message = new Message(chatMessage);
            message.save((error) => {
                if (error) debug('failed to save message', error);
            });
        });

    } else {
        // force client to disconnect if unauthenticated
        socket.emit(USER_DATA, {
            isAuthenticated: false
        });
    }

    socket.on('disconnect', () => {
        debug('client disconnected', request.session);
    });
}

module.exports = onConnection;
