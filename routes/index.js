'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();

/**
 * GET: *
 */
router.get('*', (req, res, next) => {
    const { _id, isAuthenticated } = req.session;
    res.render('index.html', {
        title: 'Express-Template',
        public: Object.assign({}, req.app.locals.public, {
            user: {
                _id,
                isAuthenticated
            }
        })
    });
});

/**
 * Export router.
 */
module.exports = router;
