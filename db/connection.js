'use strict';

/**
 * Module dependencies.
 */
const { debug } = require('./helpers');
const mongoose = require('mongoose');
const config = require('../config/');

// seed database with default data
require('./seed');

// fix warning: mpromise (mongoose's default promise library) is deprecated
// http://mongoosejs.com/docs/promises.html#plugging-in-your-own-promises-library
mongoose.Promise = global.Promise;

/**
 * Connection listeners.
 */
mongoose.connection.on('connected', () => {
    debug('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
    debug('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    debug('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
    debug('MongoDB error', err);
});

/**
 * Closes database connection.
 */
function closeConnection() {
    mongoose.connection.close(() => {
        debug('MongoDB connection closed due to process termination');
        process.exit(0);
    });
}

// graceful exit
// close connection when process is interrupted or terminated
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

// attempt to connect to database
debug('MongoDB connecting...');
mongoose
    .connect(config.mongodbConnectionUri)
    .catch((err) => {
        debug('MongoDB connect error', err);
    });

/**
 * Export mongoose connection.
 */
module.exports = mongoose.connection;
