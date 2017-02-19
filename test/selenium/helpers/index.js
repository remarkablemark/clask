'use strict';

/**
 * Module dependencies.
 */
const mocha = require('mocha');
const { driver, helpers } = require('./driver');

mocha.suiteTeardown((done) => {
    driver.quit().then(() => done());
});

/**
 * Export helpers.
 */
module.exports = {
    driver,
    helpers
};
