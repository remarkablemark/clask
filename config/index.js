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
    ),

    sessionSecret: (
        process.env.SESSION_SECRET ||
        require('crypto').randomBytes(32).toString('hex')
    )
};

/**
 * Export config.
 */
module.exports = config;
