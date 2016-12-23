'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import {
    browserHistory,
    IndexRoute,
    Redirect,
    Route,
    Router,
} from 'react-router';

// components
import Layout from './app/Layout';
import Index from './app/Index';
import SignUp from './user/SignUp';
import SignIn from './user/SignIn';
import SignOut from './user/SignOut';

/**
 * Routes.
 */
export default (
    <Router history={browserHistory}>
        <Route path='/' component={Layout}>
            <IndexRoute component={Index} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signout' component={SignOut} />
            <Redirect from='/login' to='signin' />
            <Redirect from='/logout' to='signout' />
        </Route>
    </Router>
);
