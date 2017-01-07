'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

/**
 * Message schema.
 */
const messageSchema = new mongoose.Schema({
    _user: {
        type: String,
        ref: 'User'
    },
    _room: {
        type: String,
        required: true,
        ref: 'Room'
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated: Date,
    isFirst: Boolean
});

// compound indexes
messageSchema.index({ created: 1, type: -1 }, { _room: 1 });

/**
 * Export model for `messages` collection.
 */
module.exports = mongoose.model('Message', messageSchema);
