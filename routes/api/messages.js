'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('../../db/helpers');
const router = require('express').Router();
const Message = require('../../models/message');

/**
 * GET: /api/messages/:room_id
 */
router.get('/:room_id', (req, res, next) => {
    const { room_id } = req.params;
    Message.find({
        room_id
    }, {
        room_id: 0,
        __v: 0
    }, (error, messages) => {
        if (error) {
            debug('error find message', error);
            return res.status(500).json([]);
        }
        res.json(messages);
    });
});

/**
 * Export router.
 */
module.exports = router;
