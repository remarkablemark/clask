'use strict';

/**
 * Module dependencies.
 */
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Export session middleware.
 *
 * https://github.com/expressjs/session
 */
module.exports = session({
    name: 'sid',
    secret: require('../config/').sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: require('../db/connection')
    })
});
