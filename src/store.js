'use strict';

/**
 * Module dependencies.
 */
import { combineReducers, createStore } from 'redux';
import messages from './messages/reducer';
import rooms from './rooms/reducer';
import user from './user/reducer';
import users from './users/reducer';

/**
 * Reducer.
 */
const reducer = combineReducers({
    messages,
    rooms,
    user,
    users
});

/**
 * Export store.
 */
export default createStore(reducer);
