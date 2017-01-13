'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('../db/helpers');

// mongoose
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
    socket.on(UPDATE_USER, (userId, userData) => {
        if (!userId || userData.constructor !== Object) return;

        User.findByIdAndUpdate(userId, { $set: userData }, (err) => {
            if (err) debug('failed to update user', err);
        });
    });
}

module.exports = user;
