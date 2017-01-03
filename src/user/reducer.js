'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// actions
import { SET_USER } from './actions';
import { REMOVE_ALL } from '../shared/actions';

const initialState = (
    window.__EXPRESS_TEMPLATE__.user ||
    { isAuthenticated: false }
);

/**
 * User reducer.
 *
 * @param  {Object} state       - The state.
 * @param  {Object} action      - The action.
 * @param  {String} action.type - The action type.
 * @param  {Object} action.user - The user data.
 * @return {Object}             - The state.
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return _.assign({}, state, action.user);

        case REMOVE_ALL:
            return { isAuthenticated: false };

        default:
            return state;
    }
}
