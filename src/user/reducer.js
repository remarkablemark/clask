'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';
import {
    SET_USER,
    REMOVE_USER
} from './actions';

const initialState = window.__EXPRESS_TEMPLATE__.user || {};

/**
 * User reducer.
 *
 * @param  {Object} state  - The state.
 * @param  {Object} action - The action.
 * @return {Object}        - The state.
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        // set user
        case SET_USER:
            return _.assign({}, state, action.user);

        // remove user
        case REMOVE_USER:
            return {};

        // default
        default:
            return state;
    }
}
