'use strict';

/**
 * Module dependencies.
 */
const debug = {};
debug.db = require('../db/helpers').debug;
debug.socket = require('./helpers').debug;
const ObjectId = require('mongoose').Types.ObjectId;

// models
const Message = require('../models/message');

// socket events
const {
    GET_MESSAGES,
    MESSAGES,
    NEW_MESSAGE
} = require('./events');

// constants
const messagesProjection = { __v: 0, _room: 0 };
const messagesOptions = {
    sort: { created: -1 }
};
const messagesOptionsWithLimit = Object.assign({
    limit: require('../config/constants').messagesLimit
}, messagesOptions);

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
        // send message to room
        message._id = ObjectId();
        io.to(message._room).emit(MESSAGES, message._room, [message]);

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
        if (!data || data.constructor !== Object) return;
        const { before, messageId, roomId } = data;
        if (!roomId || !before) return;

        const query = { _room: roomId };
        let options = messagesOptions;

        // load messages in changed room
        if (messageId) {
            query._id = {
                $gte: ObjectId(messageId)
            };

        // otherwise, load previous messages
        } else {
            query.created = {
                $lt: before
            };
            options = messagesOptionsWithLimit;
        }

        Message.find(query, messagesProjection, options, (err, messages) => {
            if (err) return debug.db('unable to find messages', err);

            // no messages found
            if (!messages || !messages.length) {
                return socket.emit(MESSAGES, roomId, []);
            }

            // send messages
            messages.reverse();
            if (!messageId) {
                return socket.emit(MESSAGES, roomId, messages);
            }

            // get more messages (if applicable)
            Message.find({
                _room: roomId,
                _id: { $lt: messages[0]._id }
            }, messagesProjection, messagesOptionsWithLimit, (err, moreMessages) => {
                if (err) return debug.db('unable to find messages', err);

                // no more messages found
                if (!moreMessages) return socket.emit(MESSAGES, roomId, messages);

                // send prepended messages
                moreMessages.reverse();
                socket.emit(MESSAGES, roomId, moreMessages.concat(messages))
            });
        });
    });
}

module.exports = messages;
