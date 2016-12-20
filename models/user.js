'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const generateId = require('shortid').generate;

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
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    }
});

/**
 * Export model for `users` collection.
 */
module.exports = mongoose.model('User', userSchema);
