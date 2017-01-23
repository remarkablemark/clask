'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('../db/helpers');
const {
    setUser,
    USER_KEY_ROOM
} = require('./helpers');

// models
const User = require('../models/user');

// constants
const { UPDATE_USER }  = require('./events');

/**
 * Event listeners for user.
 *
 * @param {Object} io     - The io.
 * @param {Object} socket - The socket.
 */
function user(io, socket) {
    /**
     * Update user.
     */
    socket.on(UPDATE_USER, (userId, data = {}) => {
        if (!userId || !data || data.constructor !== Object) return;

        // change active room
        const activeRoomId = data['rooms.active'];
        if (activeRoomId) {
            socket.join(activeRoomId);
            setUser(userId, {
                [USER_KEY_ROOM]: activeRoomId
            });
        }

        // update user
        User.findByIdAndUpdate(userId, { $set: data }, (err) => {
            if (err) debug('failed to update user', err);
        });
    });
}

module.exports = user;
