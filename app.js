'use strict';

/**
 * Module dependencies.
 */
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const pkg = require('./package');
const config = require('./config/');
const isProduction = config.isProduction;
require('./connection');

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
// uncomment after placing your favicon in /public
//app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(require('express-session')({
    name: 'sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'build')));

/**
 * App locals.
 */
app.locals.public = {
    isProduction: isProduction,
    publicPath: isProduction ? '' : require('./webpack/development.config').output.publicPath,
    versions: {
        'react': pkg.dependencies['react'],
        'react-dom': pkg.dependencies['react-dom'],
        'react-router': pkg.dependencies['react-router'],
        'react-redux': pkg.dependencies['react-redux'],
        'redux': pkg.dependencies['redux'],
        'socket.io': pkg.dependencies['socket.io']
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
