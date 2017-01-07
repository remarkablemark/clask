'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// actions
import { SET_ROOMS } from './actions';
import { REMOVE_ALL } from '../shared/actions';

/**
 * Rooms reducer.
 *
 * @param  {Object} state={}     - The state.
 * @param  {Object} action       - The action.
 * @param  {String} action.type  - The action type.
 * @param  {Object} action.rooms - The rooms data.
 * @return {Object}              - The state.
 */
export default function reducer(state = {}, action) {
    switch (action.type) {
        case SET_ROOMS:
            return _.merge({}, state, action.rooms);

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
