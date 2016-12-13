'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Layout from './Layout';
import Index from './Index';

/**
 * Routes.
 */
export default (
    <Router history={browserHistory}>
        <Route path='/' component={Layout}>
            <IndexRoute component={Index} />
        </Route>
    </Router>
);
