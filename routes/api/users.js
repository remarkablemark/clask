'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const router = require('express').Router();
const User = require('../../models/user');
const { reformatUsers } = require('../helpers');

/**
 * GET: /api/users
 */
router.get('/', (req, res, next) => {
    const { _id, email, username } = req.query;
    const query = {};
    if (_id) query._id = _id;
    else if (email) query.email = email;
    else if (username) query.username = username;

    User.find(query, {
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
router.post('/', (req, res, next) => {
    // try to save user
    new User(req.body).save((err, user) => {
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
            return res.status(500).json({});
        }

        // user successfully saved
        req.session.isAuthenticated = true;
        req.session._id = user._id;
        req.session.username = user.username;

        const userObj = user.toObject({ versionKey: false });
        userObj.password = undefined;
        userObj.isAuthenticated = true;

        // get users data
        User.find({}, { username: 1 }, (error, users) => {
            if (error) {
                debug('error find users', error);
                return res.status(500).json({});
            }

            res.json({
                success: true,
                message: 'Account created!',
                user: userObj,
                users: reformatUsers(users)
            });
        });
    });
});

/**
 * Export router.
 */
module.exports = router;
