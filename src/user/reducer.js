'use strict';

/**
 * Module dependencies.
 */
import {
    SET_USER,
    REMOVE_USER
} from './actions';

const {
    isAuthenticated
} = window.__EXPRESS_TEMPLATE__;

const initialState = {
    isAuthenticated
    // _id
    // username
    // name
    // email
};

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
            return Object.assign({}, state, action.user);

        // remove user
        case REMOVE_USER:
            return {};

        // default
        default:
            return state;
    }
}
