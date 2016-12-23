'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import routes from '../routes';

function reducer(state, action) {
    return state;
}

const store = createStore(reducer);

/**
 * Render app.
 */
render(
    <Provider store={store}>
        {routes}
    </Provider>,
    document.getElementById('app')
);
