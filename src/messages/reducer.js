'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';
import { reformatMessages } from './helpers';

// actions
import {
    APPEND_MESSAGES,
    PREPEND_MESSAGES
} from './actions';
import { REMOVE_ALL } from '../shared/actions';

// initial state
let initialState = window.__EXPRESS_TEMPLATE__.messages || {};
if (!_.isEmpty(initialState)) {
    _.forEach(initialState, (value, key) => {
        initialState[key] = reformatMessages(value);
    });
}

/**
 * Messages reducer.
 *
 * @param  {Object} state           - The state.
 * @param  {Object} action          - The action.
 * @param  {String} action.type     - The action type.
 * @param  {String} action.room     - The room id.
 * @param  {Array}  action.messages - The messages.
 * @return {Object}                 - The state.
 */
export default function reducer(state = initialState, action) {
    const { type, room, messages } = action;
    // current messages
    const current = state[room];

    switch (type) {
        case APPEND_MESSAGES:
            // messages found
            if (_.isArray(current)) {
                return _.assign({}, state, {
                    // start position for checking new day
                    // should be one less than the original
                    [room]: reformatMessages(
                        _.concat(current, messages), current.length - 2
                    )
                });
            }
            // messages empty
            return _.assign({}, state, {
                [room]: reformatMessages(messages)
            });

        case PREPEND_MESSAGES:
            // messages found
            if (_.isArray(current)) {
                return _.assign({}, state, {
                    [room]: _.concat(reformatMessages(messages), current)
                });
            }
            // messages empty
            return _.assign({}, state, {
                [room]: reformatMessages(messages)
            });

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
