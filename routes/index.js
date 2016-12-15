'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();

/**
 * GET index page.
 */
router.get('/', (req, res, next) => {
    res.render('index.html', {
        title: 'Express-Template'
    });
});

/**
 * Export router.
 */
module.exports = router;
