'use strict';

/**
 * Environment variables.
 */
if (!process.env.APP_NAME) {
    require('dotenv').config();
}
const { PORT } = process.env;
const base = 'http://localhost:' + PORT;

/**
 * Routes.
 */
const routes = {
    index: base + '/',
    signup: base + '/signup'
};

/**
 * Export routes.
 */
module.exports = routes;
