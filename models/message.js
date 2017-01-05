'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

/**
 * Message schema.
 */
const messageSchema = new mongoose.Schema({
    user_id: {
        type: String,
        ref: 'User'
    },
    room_id: {
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
        required: true
    },
    updated: Date,
    isFirst: Boolean
});

// compound indexes
messageSchema.index({ created: 1, type: -1 }, { room_id: 1 });

/**
 * Export model for `messages` collection.
 */
module.exports = mongoose.model('Message', messageSchema);
