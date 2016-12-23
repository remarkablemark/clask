'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import routes from '../routes';
import store from '../store';

/**
 * Render app.
 */
render(
    <Provider store={store}>
        {routes}
    </Provider>,
    document.getElementById('app')
);
