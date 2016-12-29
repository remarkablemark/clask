'use strict';

/**
 * Module dependencies.
 */
import { combineReducers, createStore } from 'redux';
import user from './user/reducer';
import users from './users/reducer';

/**
 * Reducer.
 */
const reducer = combineReducers({
    user,
    users
});

/**
 * Export store.
 */
export default createStore(reducer);
