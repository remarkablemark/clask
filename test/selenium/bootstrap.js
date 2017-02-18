'use strict';

/**
 * Module dependencies.
 */
const webdriven = require('webdriven');
const driver = webdriven.build('chrome');

/**
 * Export driver.
 */
module.exports = {
    driver,
    helpers: webdriven(driver)
};
