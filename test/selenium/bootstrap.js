'use strict';

/**
 * Module dependencies.
 */
const { suiteTeardown } = require('mocha');
const webdriven = require('webdriven');
const driver = webdriven.build('chrome');

// mocha teardown
suiteTeardown(() => driver.quit());

/**
 * Export driver.
 */
module.exports = {
    driver,
    helpers: webdriven(driver)
};
