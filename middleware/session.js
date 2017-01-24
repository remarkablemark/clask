'use strict';

/**
 * Module dependencies.
 */
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongooseConnection = require('../db/connection');
const { isProduction, sessionSecret } = require('../config/');

/**
 * Export session middleware.
 *
 * https://github.com/expressjs/session
 */
module.exports = session({
    name: 'sid',
    secret: sessionSecret,
    cookie: {
        secure: isProduction,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection }),
    unset: 'destroy'
});
