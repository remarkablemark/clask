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
            // authentication
            if (user.validatePassword(password, (error, isMatch) => {
                // server error
                if (error) {
                    debug('unable to validate password', error);
                    return res.status(500).json({});
                }

                // success
                if (isMatch) {
                    req.session.isAuthenticated = true;
                    req.session._id = user._id;
                    res.json({
                        success: true,
                        message: 'Authentication successful.',
                        user: {
                            isAuthenticated: true,
                            _id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            activeRoom: user.activeRoom,
                            sidebar: user.sidebar,
                            channels: user.channels
                        }
                    });

                // failure
                } else {
                    res.json({
                        success: false,
                        message: 'Sorry, you entered an incorrect email address or password.'
                    });
                }
            }));
        }
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
