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

    User.findOne({ email }, { __v: 0 }, (error, user) => {
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
            req.session.isAuthenticated = true;
            req.session._id = user._id;

            const userObj = user.toObject();
            delete userObj.password;
            userObj.isAuthenticated = true;

            res.json({
                success: true,
                message: 'Authentication successful.',
                user: userObj
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
