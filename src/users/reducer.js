'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';
import { SET_USERS } from './actions';

const initialState = window.__EXPRESS_TEMPLATE__.users || {};

/**
 * Users reducer.
 *
 * @param  {Object} state  - The state.
 * @param  {Object} action - The state.
 * @return {Object}        - The state.
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        // set users
        case SET_USERS:
            return _.merge({}, state, action.users);

        // default
        default:
            return state;
    }
}
