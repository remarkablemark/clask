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
        required: true
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

/**
 * Export model for `messages` collection.
 */
module.exports = mongoose.model('Message', messageSchema);
