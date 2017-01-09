'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// actions
import { SET_USER } from './actions';
import { REMOVE_ALL } from '../shared/actions';

// state
const unauthenticatedState = { isAuthenticated: false };
const initialState = window.__EXPRESS_TEMPLATE__.user || unauthenticatedState;

/**
 * User reducer.
 *
 * @param  {Object} state         - The state.
 * @param  {Object} [action]      - The action.
 * @param  {String} [action.type] - The action type.
 * @param  {Object} [action.user] - The user data.
 * @return {Object}               - The state.
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return _.merge({}, state, action.user);

        case REMOVE_ALL:
            return unauthenticatedState;

        default:
            return state;
    }
}
