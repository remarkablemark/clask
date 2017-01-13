'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';
import { reformatMessages } from './helpers';

// actions
import { UPDATE_MESSAGES } from './actions';
import { REMOVE_ALL } from '../shared/actions';

/**
 * Messages reducer.
 *
 * @param  {Object} state={}        - The state.
 * @param  {Object} action          - The action.
 * @param  {String} action.type     - The action type.
 * @param  {String} action.roomId   - The room id.
 * @param  {Array}  action.messages - The messages.
 * @return {Object}                 - The state.
 */
export default function reducer(state = {}, action) {
    const { type, roomId, messages } = action;
    // current messages
    const current = state[roomId];

    switch (type) {
        case UPDATE_MESSAGES: {
            // messages empty
            if (!_.isArray(messages) || !messages.length) return state;

            // current messages empty
            if (!_.isArray(current)) {
                return _.assign({}, state, {
                    [roomId]: reformatMessages(messages)
                });
            }

            // messages found
            const firstMessage = _.first(messages);
            firstMessage.created = new Date(firstMessage.created);
            let lastMessage = firstMessage;
            if (messages.length > 1) {
                lastMessage = _.last(messages);
                lastMessage.created = new Date(lastMessage.created);
            }

            // append messages
            if (firstMessage.created > _.last(current).created) {
                // start position for marking new day should be
                // one less than the current (original) total
                const currentLen = current.length;
                const start = currentLen > 1 ? currentLen - 2 : 0;
                return _.assign({}, state, {
                    [roomId]: reformatMessages(
                        _.concat(current, messages), start
                    )
                });

            // prepend messages
            } else if (lastMessage.created < _.first(current).created) {
                return _.assign({}, state, {
                    // end position for marking new day should be
                    // one more than the messages total
                    [roomId]: reformatMessages(
                        _.concat(messages, current), 0, messages.length + 1
                    )
                });

            // update messages
            } else {
                const clone = _.cloneDeep(current);
                _.forEach(messages, (message) => {
                    const index = _.findLastIndex(clone, { _id: messages._id });
                    if (index !== -1) {
                        clone[index] = message;
                    }
                });
                return _.assign({}, state, {
                    [roomId]: clone
                });
            }
        }

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
