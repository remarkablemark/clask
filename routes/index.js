'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();
const debug = require('debug')(process.env.APP_NAME + ':db');
const { Promise } = global;
const User = require('../models/user');

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

    ]).then((results) => {
        const user = results[0];
        const users = results[1];
        user.isAuthenticated = true;

        res.render('index.html', {
            title: 'Express-Template',
            public: Object.assign({}, req.app.locals.public, {
                user,
                users
            })
        });

    }).catch((error) => {
        debug('unable to find user and users', error);
        res.status(500).send('Internal Server Error');
    });
});

/**
 * Export router.
 */
module.exports = router;
