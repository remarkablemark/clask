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
    // defined for channel
    // undefined for direct message
    name: String,
    users: [
        {
            type: String,
            ref: 'User'
        }
    ],
    creator: {
        type: String,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    isPublic: Boolean
});

/**
 * Export model for `rooms` collection.
 */
module.exports = mongoose.model('Room', roomSchema);
