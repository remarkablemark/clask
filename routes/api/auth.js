'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();
const { reformatUsers } = require('../helpers');
const { Promise } = global;

// models
const Message = require('../../models/message');
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
            req.session.username = user.username;

            const userObj = user.toObject();
            userObj.password = undefined;
            userObj.isAuthenticated = true;

            // get users and messages
            Promise.all([
                User.find({}, { username: 1 }).lean().exec(),
                Message.find({
                    room_id: user.rooms.active
                }, {
                    __v: 0,
                    room_id: 0
                }).lean().exec()

            // success
            ]).then(results => {
                const users = reformatUsers(results[0]);
                const messages = results[1];
                res.json({
                    success: true,
                    message: 'Authentication successful.',
                    messages,
                    user: userObj,
                    users
                });

            // error
            }).catch(error => {
                debug('unable to find users and messages', error);
                res.status(500).send({});
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
