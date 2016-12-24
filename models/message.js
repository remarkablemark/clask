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
    text: String,
    time: Date
});

/**
 * Export model for `messages` collection.
 */
module.exports = mongoose.model('Message', messageSchema);
