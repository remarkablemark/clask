'use strict';

/**
 * Module dependencies.
 */
import { SET_SOCKET } from './actions';
import { REMOVE_ALL } from '../shared/actions';

/**
 * Socket reducer.
 *
 * @param  {Object} state={}        - The state.
 * @param  {Object} action          - The action.
 * @param  {String} action.type     - The action type.
 * @param  {Object} [action.socket] - The socket.
 * @return {Object}                 - The state.
 */
export default function reducer(state = {}, action) {
    const { type, socket } = action;
    switch (type) {
        case SET_SOCKET:
            if (typeof socket === 'object' &&
                typeof socket.emit === 'function' &&
                typeof socket.on === 'function') {
                return socket;
            }
            return state;

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
