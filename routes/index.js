'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();

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
    // denote authentication so a refresh
    // does not force the user to sign in again
    let { _public } = req.app.locals;
    if (req.session && req.session.isAuthenticated) {
        _public = Object.assign({}, _public, {
            user: { isAuthenticated: true }
        });
    }

    res.render('index.html', {
        title: 'Express-Template',
        _public
    });
});

/**
 * Export router.
 */
module.exports = router;
