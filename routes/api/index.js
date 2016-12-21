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
 * POST: /api/auth
 */
router.post('/auth', (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.json({});
    if (!password) return res.json({});

    User.findOne({ email }, (error, user) => {
        if (error) {
            debug('error find user', error)
            return res.status(500).json({});
        }

        // user not found
        if (!user) {
            return res.json({
                success: false,
                message: 'Sorry, you entered an incorrect email address or password.'
            });

        // user found
        } else {
            const { _id, name, username, email } = user;

            // authentication success
            if (password === user.password) {
                res.json({
                    success: true,
                    message: 'Authentication successful.',
                    user: {
                        _id,
                        name,
                        username,
                        email
                    }
                });

            // authentication failure
            } else {
                res.json({
                    success: false,
                    message: 'Sorry, you entered an incorrect email address or password.'
                });
            }
        }
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
 * POST: /api/users
 */
router.post('/users', (req, res, next) => {
    // try to save user
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            // duplicate key error
            if (err.code === 11000) {

                // duplicate email
                if (/email/.test(err.errmsg)) {
                    return res.json({
                        success: false,
                        error: {
                            field: 'email',
                            text: 'Email already exists.'
                        }
                    });

                // duplicate username
                } else if (/username/.test(err.errmsg)) {
                    return res.json({
                        success: false,
                        error: {
                            field: 'username',
                            text: 'Username is taken.'
                        }
                    });
                }
            }

            // other error
            debug('error save user', err);
            return res.json({
                success: false,
                message: 'Server error, please try again.'
            });
        }

        // user successfully saved
        res.json({
            success: true,
            message: 'Account created!'
        });
    });
});

/**
 * Export router.
 */
module.exports = router;
