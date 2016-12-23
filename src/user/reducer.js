'use strict';

/**
 * Module dependencies.
 */
import {
    SET_AUTHENTICATION,
    REMOVE_USER
} from './actions';

const {
    isAuthenticated
} = window.__EXPRESS_TEMPLATE__;

const initialState = {
    isAuthenticated
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
        // set authentication
        case SET_AUTHENTICATION:
            return Object.assign({}, state, {
                isAuthenticated: action.isAuthenticated
            });

        // remove user
        case REMOVE_USER:
            return {};

        // default
        default:
            return state;
    }
}
