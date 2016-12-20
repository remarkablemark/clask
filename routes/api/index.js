'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();
const Message = require('../../models/message');
const User = require('../../models/user');

/**
 * GET: /api/messages
 */
router.get('/messages', (req, res, next) => {
    Message.find({}, {
        _id: 0,
        text: 1,
        time: 1
    }, (error, messages) => {
        if (error) {
            debug('error find message', error);
            return res.status(500).json([]);
        }
        res.json(messages);
    });
});

/**
 * GET: /api/users
 */
router.get('/users', (req, res, next) => {
    const { _id, email, username } = req.query;
    const query = {};
    if (_id) query._id = _id;
    else if (email) query.email = email;
    else if (username) query.username = username;

    User.find(query, {
        _id: 0,
        name: 1,
        username: 1,
    }, (error, user) => {
        if (error) {
            debug('error find user', error)
            return res.status(500).json({});
        }
        res.json(user);
    });
});

/**
 * Export router.
 */
module.exports = router;
