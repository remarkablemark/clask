'use strict';

/**
 * Environment variables.
 */
if (!process.env.APP_NAME) require('dotenv').load();
const {
    APP_NAME,
    MONGODB_CONNECTION_URI,
    NODE_ENV,
    SESSION_SECRET
} = process.env;

/**
 * Configuration.
 */
const config = {
    // fallback to package name if environment variable is blank
    appName: APP_NAME ? APP_NAME : require('../package').name,

    isProduction: NODE_ENV === 'production',

    // MongoDB connection string uri
    // https://docs.mongodb.com/manual/reference/connection-string/
    mongodbConnectionUri: (
        MONGODB_CONNECTION_URI || `mongodb://localhost/${APP_NAME}`
    ),

    sessionSecret: (
        SESSION_SECRET || require('crypto').randomBytes(32).toString('hex')
    )
};

/**
 * Export config.
 */
module.exports = config;
