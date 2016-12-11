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
            'socket': [
                `//cdnjs.cloudflare.com/ajax/libs/socket.io/${versions['socket.io']}/socket.io.min`
            ]
        }
    });
}

/**
 * Load app.
 */
if (isProduction) {
    requirejs([
        'react', 'react-dom', 'react-router', 'socket'
    ], (React, ReactDOM, ReactRouter, io) => {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.ReactRouter = ReactRouter;
        const socket = io.connect();
        require('./routes');
    });
} else {
    requirejs(['socket'], (io) => {
        const socket = io.connect();
        require('./routes');
    });
}
