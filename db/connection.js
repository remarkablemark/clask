'use strict';

/**
 * Module dependencies.
 */
const debug = require('debug')(process.env.APP_NAME + ':db');
const mongoose = require('mongoose');
const config = require('../config/');

// fix warning: mpromise (mongoose's default promise library) is deprecated
// http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library
mongoose.Promise = global.Promise;

/**
 * Connection listeners.
 */
mongoose.connection.on('connected', () => {
    debug('connected to database');
});

mongoose.connection.on('error', () => {
    debug('failed to connect to database');
});

mongoose.connection.on('disconnected', () => {
    debug('disconnected from database');
});

/**
 * Closes database connection.
 */
function closeConnection() {
    mongoose.connection.close(() => {
        debug('closed database connection due to process termination');
        process.exit(0);
    });
}

// graceful exit
// close connection when process is interrupted or terminated
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

// attempt to connect to database
debug('connecting to database...');
mongoose.connect(config.mongodbConnectionUri);

/**
 * Export mongoose connection.
 */
module.exports = mongoose.connection;
