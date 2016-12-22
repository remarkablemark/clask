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
 * Route: /api/messages
 */
router.use(require('./messages'));

/**
 * Route: /api/users
 */
router.use(require('./users'));

/**
 * Export router.
 */
module.exports = router;
