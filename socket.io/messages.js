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
const { MESSAGES } = require('./events');

/**
 * Event listeners for messages.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function messages(io, socket) {
    // messages from client
    socket.on(MESSAGES, (messages) => {
        messages[0]._id = ObjectId();
        io.emit(MESSAGES, messages);

        // save to database
        const message = new Message(messages[0]);
        message.save((error) => {
            if (error) return debug.db('failed to save message', error);
        });
        debug.socket(MESSAGES, messages);
    });
}

module.exports = messages;
