'use strict';

/**
 * Module dependencies.
 */
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const { dependencies } = require('./package');
const config = require('./config/');
const isProduction = config.isProduction;

/**
 * Express app.
 */
const app = express();

/**
 * View engine.
 */
app.set('views', path.join(__dirname, 'views'));
require('nunjucks').configure('views', {
    autoescape: true,
    express: app,
    noCache: !isProduction ? true : false
});

/**
 * Middleware.
 */
// uncomment after placing your favicon in /build
//app.use(require('serve-favicon')(path.join(__dirname, 'build', 'favicon.ico')));

// logger
app.use(logger('dev'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie (must come before session)
app.use(require('cookie-parser')());

// session
app.use(require('./middleware/session'));

// static
app.use(express.static(path.join(__dirname, 'build')));

/**
 * App locals.
 */
app.locals._public = {
    isProduction: isProduction,
    publicPath: isProduction ? '' : require('./webpack/development.config').output.publicPath,
    versions: {
        'lodash': dependencies['lodash'],
        'react-router': dependencies['react-router'],
        'react-redux': dependencies['react-redux'],
        'redux': dependencies['redux'],
        'socket.io': dependencies['socket.io']
    }
};

/**
 * Routes.
 */
app.use('/api', require('./routes/api/'));
app.use('/', require('./routes/index'));

/**
 * 404.
 */
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error.
 */
// development error handler will print stacktrace
if (!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler will not leak stacktraces to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

/**
 * Export app.
 */
module.exports = app;
