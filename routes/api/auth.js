'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();

// models
const User = require('../../models/user');

/**
 * POST: /api/auth
 */
router.post('/auth', (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.json({});
    if (!password) return res.json({});

    User.findOne({
        email
    }, {
        password: 1,
        username: 1
    }, (error, user) => {
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
        }

        // user found
        user.validatePassword(password, (error, isMatch) => {
            // server error
            if (error) {
                debug('unable to validate password', error);
                return res.status(500).json({});
            }

            // validation failure
            if (!isMatch) {
                return res.json({
                    success: false,
                    message: 'Sorry, you entered an incorrect email address or password.'
                });
            }

            // validation success
            req.session._id = user._id;
            req.session.isAuthenticated = true;
            req.session.username = user.username;

            res.json({
                success: true,
                message: 'Authentication successful.',
                user: {
                    isAuthenticated: true
                }
            });
        });
    });
});

/**
 * DELETE: /api/auth
 */
router.delete('/auth', (req, res, next) => {
    req.session.destroy();
    res.json({
        message: 'Logged out.'
    });
});

/**
 * Export router.
 */
module.exports = router;
