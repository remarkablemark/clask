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
    res.render('index.html', {
        title: 'Express-Template'
    });
});

/**
 * Export router.
 */
module.exports = router;
