'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();

/**
 * GET: *
 */
router.get('*', (req, res, next) => {
    res.render('index.html', {
        title: 'Express-Template',
        public: Object.assign({}, req.app.locals.public, {
            isAuthenticated: req.session.isAuthenticated
        })
    });
});

/**
 * Export router.
 */
module.exports = router;
