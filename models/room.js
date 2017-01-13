'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const generateId = require('shortid').generate;

/**
 * Room schema.
 */
const roomSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
        default: generateId
    },
    // defined = channel
    // undefined = direct message
    name: {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    _users: {
        type: Array,
        ref: 'User'
    },
    _creator: {
        type: String,
        ref: 'User'
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    }
});

/**
 * Export model for `rooms` collection.
 */
module.exports = mongoose.model('Room', roomSchema);
