'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();
const User = require('../../models/user');

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
 * Export router.
 */
module.exports = router;
