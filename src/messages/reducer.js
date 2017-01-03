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

/**
 * Messages reducer.
 *
 * @param  {Object} state={}        - The state.
 * @param  {Object} action          - The action.
 * @param  {String} action.type     - The action type.
 * @param  {String} action.room     - The room id.
 * @param  {Array}  action.messages - The messages.
 * @return {Object}                 - The state.
 */
export default function reducer(state = {}, action) {
    const { type, room, messages } = action;
    // current messages
    const current = state[room];

    switch (type) {
        case APPEND_MESSAGES:
            // messages found
            if (_.isArray(current)) {
                return _.assign({}, state, {
                    // start position for marking new day should be
                    // one less than the current (original) total
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
                    // end position for marking new day should be
                    // one more than the messages total
                    [room]: reformatMessages(
                        _.concat(messages, current), 0, messages.length + 1
                    )
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
