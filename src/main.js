'use strict';

/**
 * Constants.
 */
const {
    isProduction,
    versions
} = window[`__${process.env.APP_NAME}__`];
const { define, requirejs } = window;

/**
 * RequireJS config.
 */
if (requirejs) {
    requirejs.config({
        paths: {
            'io': [
                `//cdnjs.cloudflare.com/ajax/libs/socket.io/${versions['socket.io']}/socket.io.min`
            ],
            'lodash': [
                `//cdnjs.cloudflare.com/ajax/libs/lodash.js/${versions['lodash']}/lodash.min`
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
        }
    });
}

/**
 * Load app.
 */
if (isProduction) {
    // disable React Developer Tools in production (if applicable)
    // https://github.com/facebook/react-devtools/issues/191
    const devtoolsHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (typeof devtoolsHook === 'object') {
        devtoolsHook.inject = () => {};
    }

    // bundle `react` and `react-dom` in production build
    // because `react-tap-event-plugin` modifies `react-dom`
    define('react', require('react'));
    define('react-dom', require('react-dom'));

    requirejs([
        'react-router', 'redux', 'react-redux', 'lodash'
    ], (ReactRouter, Redux, ReactRedux) => {
        window.ReactRouter = ReactRouter;
        window.Redux = Redux;
        window.ReactRedux = ReactRedux;
        require('./app/App');
    });

} else {
    require('./app/App');
}
