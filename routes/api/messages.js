'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();
const Message = require('../../models/message');

/**
 * GET: /api/messages
 */
router.get('/', (req, res, next) => {
    Message.find({}, {
        _id: 0,
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
