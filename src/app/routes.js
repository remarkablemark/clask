'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// components
import Layout from './Layout';
import Index from './Index';
import SignUp from '../user/SignUp';
import SignIn from '../user/SignIn';

/**
 * Routes.
 */
export default (
    <Router history={browserHistory}>
        <Route path='/' component={Layout}>
            <IndexRoute component={Index} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
        </Route>
    </Router>
);
