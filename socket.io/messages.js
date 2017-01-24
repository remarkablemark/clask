'use strict';

/**
 * Module dependencies.
 */
const ObjectId = require('mongoose').Types.ObjectId;
const helpers = require('./helpers');
const { getUser } = helpers;
const debug = {
    db: require('../db/helpers').debug,
    socket: helpers.debug
};

// constants
const {
    USER_KEY_SOCKET,
    USER_KEY_ROOM
} = helpers;
const { directMessages } = require('../config/constants');

// models
const Message = require('../models/message');
const User = require('../models/user');

// socket events
const {
    GET_MESSAGES,
    MESSAGES,
    NEW_MESSAGE,
    USER
} = require('./events');

// constants
const userOptions = { new: true };
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
    socket.on(NEW_MESSAGE, (message = {}, users = [], type) => {
        if (!message.text) return;
        message._id = ObjectId();
        const roomId = message._room;

        // send message to room
        io.to(roomId).emit(MESSAGES, roomId, [message]);

        // save message to database
        new Message(message).save((err) => {
            if (err) debug.db('failed to save message', err);
        });

        // direct message type
        if (type === directMessages) {
            // get all users except creator
            const creatorId = message._user;
            const otherUsers = users.filter(userId => userId !== creatorId);

            otherUsers.forEach((userId) => {
                const userRef = getUser(userId);

                // no-op if the other user is in the same active room
                if (userRef && userRef[USER_KEY_ROOM] === roomId) return;

                // otherwise update user history with mention
                User.findByIdAndUpdate(userId, {
                    $addToSet: {
                        'rooms.sidebar.directMessages': roomId
                    },
                    $inc: {
                        [`rooms.history.${roomId}.mentions`]: 1
                    }
                }, userOptions, (err, user) => {
                    if (err) return debug.db('unable to update user', err);

                    // send other user updated room info if connected
                    if (userRef && userRef[USER_KEY_SOCKET]) {
                        io.to(userRef[USER_KEY_SOCKET]).emit(USER, {
                            rooms: {
                                sidebar: {
                                    directMessages: user.rooms.sidebar.directMessages
                                },
                                history: {
                                    [roomId]: user.rooms.history[roomId]
                                }
                            }
                        });
                    }
                });
            });
        }
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
