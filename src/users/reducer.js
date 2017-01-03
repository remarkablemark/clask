'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// actions
import { SET_USERS } from './actions';
import { REMOVE_ALL } from '../shared/actions';

/**
 * Users reducer.
 *
 * @param  {Object} state={}     - The state.
 * @param  {Object} action       - The action.
 * @param  {String} action.type  - The action type.
 * @param  {Object} action.users - The users data.
 * @return {Object}              - The state.
 */
export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_USERS:
            return _.merge({}, state, action.users);

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
