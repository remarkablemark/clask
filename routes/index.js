'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();
const debug = require('debug')(process.env.APP_NAME + ':db');
const { reformatUsers } = require('./helpers');
const { Promise } = global;

// models
const Message = require('../models/message');
const User = require('../models/user');

/**
 * GET: /logout
 */
router.get('/logout', (req, res, next) => {
    res.redirect('/signout');
});

/**
 * GET: /signout
 */
router.get('/signout', (req, res, next) => {
    req.session.regenerate(() => next());
});

/**
 * GET: *
 */
router.get('*', (req, res, next) => {
    const { _id, isAuthenticated } = req.session;

    if (!isAuthenticated) {
        return res.render('index.html', {
            title: 'Express-Template'
        });
    }

    // authenticated
    Promise.all([
        User.findOne({ _id }, { password: 0, __v: 0 }).lean().exec(),
        User.find({}, { username: 1 }).lean().exec()

    // success
    ]).then(results => {
        const user = results[0];
        const users = reformatUsers(results[1]);
        user.isAuthenticated = true;
        const activeRoom = user.rooms.active;

        // get messages
        Message.find({
            room_id: activeRoom
        }, {
            __v: 0,
            room_id: 0
        }, (error, messages) => {
            if (error) {
                debug('error find messages', error)
                return res.status(500).send('Internal Server Error');
            }

            res.render('index.html', {
                title: 'Express-Template',
                public: Object.assign({}, req.app.locals.public, {
                    messages: {
                        [activeRoom]: messages
                    },
                    user,
                    users
                })
            });
        });

    // error
    }).catch(error => {
        debug('unable to find user and users', error);
        res.status(500).send('Internal Server Error');
    });
});

/**
 * Export router.
 */
module.exports = router;
