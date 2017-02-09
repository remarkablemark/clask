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
    if (!req.session.isAuthenticated) return next();
    req.session.regenerate(() => next());
});

/**
 * GET: *
 */
router.get('*', (req, res, next) => {
    // include authentication boolean in data so
    // user will not need to login again if page is refreshed
    let _public = req.app.locals._public || {};
    if (req.session.isAuthenticated) {
        _public = Object.assign({
            user: { isAuthenticated: true }
        }, _public);
    }
    res.render('index.html', { _public, title: _public.appName });
});

/**
 * Export router.
 */
module.exports = router;
