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
router.get('/messages', (req, res, next) => {
    Message.find({}, {
        _id: 0,
        text: 1,
        time: 1
    }, (error, messages) => {
        if (error) debug('unable to find messages', error);
        res.json(messages);
    });
});

/**
 * Export router.
 */
module.exports = router;
