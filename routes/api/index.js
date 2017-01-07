'use strict';

/**
 * Module dependencies.
 */
const router = require('express').Router();

/**
 * Route: /api/auth
 */
router.use(require('./auth'));

/**
 * Route: /api/users
 */
router.use('/users', require('./users'));

/**
 * Route: /api/*
 */
router.use('*', (req, res, next) => {
    res.status(404).json({
        message: 'Not found.'
    });
});

/**
 * Export router.
 */
module.exports = router;
