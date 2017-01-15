'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const generateId = require('shortid').generate;
const bcrypt = require('bcrypt');
const { debug } = require('../db/helpers');
const { defaultRoom } = require('../config/constants');

/**
 * User schema.
 */
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        default: generateId
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    rooms: {
        sidebar: {
            channels: {
                type: Array,
                ref: 'Room',
                default: [defaultRoom]
            },
            directMessages: Array
        },
        active: {
            type: String,
            ref: 'Room',
            default: defaultRoom
        },
        history: Object
    }
});

/**
 * Middleware.
 */
userSchema.pre('save', function(next) {
    // only hash the password if it's new or modified
    if (!this.isModified('password')) return next();

    // generate salt (with default salt work factor of 10)
    bcrypt.genSalt((error, salt) => {
        if (error) return debug('unable to generate salt', error);

        // hash password with salt
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return debug('unable to hash password', error);

            // override with hashed password
            this.password = hash;
            next();
        });
    });
});

/**
 * Compares user password.
 *
 * @param {String}     password - The password.
 * @param {validateCb} callback - The callback.
 */
userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if (typeof callback !== 'function') {
            return debug(new TypeError('callback is not a function'));
        }
        if (error) return callback(error);
        callback(null, isMatch)
    });
};

/**
 * Callback for `validatePassword()`.
 *
 * @callback validateCb
 * @param    {Object}  error     - The error.
 * @param    {Boolean} [isMatch] - The truth value.
 */

/**
 * Export model for `users` collection.
 */
module.exports = mongoose.model('User', userSchema);
