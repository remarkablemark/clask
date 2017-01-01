'use strict';

/**
 * Module dependencies.
 */
import { combineReducers, createStore } from 'redux';
import messages from './messages/reducer';
import user from './user/reducer';
import users from './users/reducer';

/**
 * Reducer.
 */
const reducer = combineReducers({
    messages,
    user,
    users
});

/**
 * Export store.
 */
export default createStore(reducer);
