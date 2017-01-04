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
    MESSAGES
} = require('./events');

// constants
const { messagesLimit } = require('../config/constants');

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

    // client requests previous messages
    socket.on(GET_MESSAGES, (data) => {
        Message.find({
            created: { $lt: data.before }
        }, { __v: 0 }, {
            limit: messagesLimit,
            sort: { created: -1 }
        }, (error, messages) => {
            if (error) return debug.db('unable to find messages', error);
            socket.emit(MESSAGES, messages.reverse());
        });
    });
}

module.exports = messages;
