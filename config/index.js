'use strict';

/**
 * Module dependencies.
 */
if (typeof process.env.APP_NAME !== 'string') {
    require('dotenv').load();
}

/**
 * Configuration.
 */
const config = {
    isProduction: process.env.NODE_ENV === 'production',

    // MongoDB connection string uri
    // https://docs.mongodb.com/manual/reference/connection-string/
    mongodbConnectionUri: (
        process.env.MONGODB_CONNECTION_URI ||
        `mongodb://localhost/${process.env.APP_NAME}`
    )
};

/**
 * Export config.
 */
module.exports = config;
