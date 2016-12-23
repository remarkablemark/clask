'use strict';

/**
 * Module dependencies.
 */
import { combineReducers, createStore } from 'redux';
import userReducer from './user/reducer';

/**
 * Reducer.
 */
const reducer = combineReducers({
    user: userReducer
});

/**
 * Export store.
 */
export default createStore(reducer);
