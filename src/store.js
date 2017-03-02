'use strict';

/**
 * Module dependencies.
 */
import {
    applyMiddleware,
    combineReducers,
    createStore
} from 'redux';

// reducers
import messages from './messages/reducer';
import rooms from './rooms/reducer';
import socket from './socket/reducer';
import user from './user/reducer';
import users from './users/reducer';

/**
 * Reducer.
 */
const reducer = combineReducers({
    messages,
    rooms,
    socket,
    user,
    users
});

/**
 * Middleware.
 */
let middleware;
if (process.env.NODE_ENV === 'development') {
    middleware = applyMiddleware(require('redux-logger')());
}

/**
 * Store.
 */
export default createStore(reducer, middleware);
