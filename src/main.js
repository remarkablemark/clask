'use strict';

/**
 * Constants.
 */
const { requirejs } = window;
const data = window.__EXPRESS_TEMPLATE__;
const { isProduction, versions } = data;

/**
 * RequireJS config.
 */
if (requirejs) {
    requirejs.config({
        paths: {
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
            'socket': [
                `//cdnjs.cloudflare.com/ajax/libs/socket.io/${versions['socket.io']}/socket.io.min`
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

/**
 * Load app.
 */
if (isProduction) {
    requirejs([
        'react', 'react-dom', 'react-router', 'redux', 'react-redux', 'socket'
    ], (React, ReactDOM, ReactRouter, Redux, ReactRedux, io) => {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.ReactRouter = ReactRouter;
        window.Redux = Redux;
        window.ReactRedux = ReactRedux;
        const socket = io.connect();
        require('./app/App');
    });
} else {
    requirejs(['socket'], (io) => {
        const socket = io.connect();
        require('./app/App');
    });
}
