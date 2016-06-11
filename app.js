'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

/**
 * Initialize Express app.
 */
var app = express();
var isDevelopment = process.env.NODE_ENV === 'development';

/**
 * View engine setup.
 */
app.set('views', path.join(__dirname, 'views'));
require('nunjucks').configure('views', {
    autoescape: true,
    express: app,
    noCache: isDevelopment ? true : false
});

/**
 * Middleware.
 */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes.
 */
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error middleware.
 */
// development error handler will print stacktrace
if (isDevelopment) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler will not leak stacktraces to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

/**
 * Export Express app.
 */
module.exports = app;
