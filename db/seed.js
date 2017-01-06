'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('./helpers')
const { defaultRoom } = require('../config/constants');
const Room = require('../models/room');

/**
 * Create default channel (if applicable).
 */
Room.findById(defaultRoom, (err, room) => {
    if (err) return debug(err);
    if (!room) {
        new Room({
            _id: defaultRoom,
            name: defaultRoom,
            isPublic: true
        }).save();
    }
});
