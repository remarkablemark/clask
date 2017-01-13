'use strict';

/**
 * Module dependencies.
 */
const debug = {};
debug.db = require('../db/helpers').debug;
debug.socket = require('./helpers').debug;

// mongoose
const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../models/message');

// socket events
const {
    GET_MESSAGES,
    MESSAGES,
    NEW_MESSAGE
} = require('./events');

// constants
const messagesProjection = { __v: 0 };
const messagesOptions = {
    limit: require('../config/constants').messagesLimit,
    sort: { created: -1 }
};

/**
 * Event listeners for messages.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function messages(io, socket) {
    /**
     * New message from client.
     */
    socket.on(NEW_MESSAGE, (message) => {
        message._id = ObjectId();
        io.emit(MESSAGES, [message]);

        // save to database
        new Message(message).save((err) => {
            if (err) debug.db('failed to save message', err);
        });
        debug.socket(NEW_MESSAGE, message);
    });

    /**
     * Client requests older messages.
     */
    socket.on(GET_MESSAGES, (data) => {
        if (typeof data !== 'object' && !data.before && !data.roomId) return;

        // find messages before date
        Message.find({
            _room: data.roomId,
            created: {
                $lt: data.before
            }
        }, messagesProjection, messagesOptions, (error, messages) => {
            if (error || !messages) return debug.db('unable to find messages', error);
            socket.emit(MESSAGES, messages.reverse());
            debug.socket(MESSAGES, messages);
        });
    });
}

module.exports = messages;
