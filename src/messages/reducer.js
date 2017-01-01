'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';
import {
    APPEND_MESSAGES,
    PREPEND_MESSAGES
} from './actions';
const initialState = window.__EXPRESS_TEMPLATE__.messages || {};

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

    switch (type) {
        case APPEND_MESSAGES:
            // messages found
            if (_.isArray(state[room])) {
                return _.assign({}, state, {
                    [room]: _.concat(state[room], messages)
                });
            }
            // messages empty
            return _.assign({}, state, {
                [room]: messages
            });

        case PREPEND_MESSAGES:
            // messages found
            if (_.isArray(state[room])) {
                return _.assign({}, state, {
                    [room]: _.concat(messages, state[room])
                });
            }
            // messages empty
            return _.assign({}, state, {
                [room]: messages
            });

        default:
            return state;
    }
}
