'use strict';

/**
 * Constants.
 */
const { requirejs, define } = window;
const data = window.__EXPRESS_TEMPLATE__;
const { isProduction, versions } = data;

/**
 * RequireJS config.
 */
if (requirejs) {
    requirejs.config({
        paths: {
            'io': [
                `//cdnjs.cloudflare.com/ajax/libs/socket.io/${versions['socket.io']}/socket.io.min`
            ],
            'react': [
                `//cdnjs.cloudflare.com/ajax/libs/react/${versions['react']}/react.min`
            ],
            'react-dom': [
                `//cdnjs.cloudflare.com/ajax/libs/react/${versions['react-dom']}/react-dom.min`
            ],
            'react-router': [
                `//cdnjs.cloudflare.com/ajax/libs/react-router/${versions['react-router']}/ReactRouter.min`
            ],
            'react-redux': [
                `//cdnjs.cloudflare.com/ajax/libs/react-redux/${versions['react-redux']}/react-redux.min`
            ],
            'redux': [
                `//cdnjs.cloudflare.com/ajax/libs/redux/${versions['redux']}/redux.min`
            ],
            'superagent': [
                '//cdnjs.cloudflare.com/ajax/libs/superagent/3.3.1/superagent.min'
            ]
        },
        shim: {
            'react-redux': {
                exports: 'ReactRedux',
                deps: ['react', 'redux']
            },
            'react-router': {
                exports: 'ReactRouter',
                deps: ['react']
            }
        }
    });
}

define('socket', ['io'], (io) => {
    return io.connect();
});

/**
 * Load app.
 */
if (isProduction) {
    requirejs([
        'react', 'react-dom', 'react-router', 'redux', 'react-redux'
    ], (React, ReactDOM, ReactRouter, Redux, ReactRedux) => {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.ReactRouter = ReactRouter;
        window.Redux = Redux;
        window.ReactRedux = ReactRedux;
        require('./app/App');
    });
} else {
    require('./app/App');
}
