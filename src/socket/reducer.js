'use strict';

/**
 * Module dependencies.
 */
import { SET_SOCKET } from './actions';
import { REMOVE_ALL } from '../shared/actions';

/**
 * Creates a socket factory.
 *
 * @param  {String}   socketMethod    - The socket method.
 * @param  {Object}   [defaultMethod] - The default method.
 * @return {Function}
 */
function socketFactory(socketMethod, defaultMethod) {
    // fallback to default if not a function
    if (typeof socketMethod !== 'function') {
        if (typeof defaultMethod !== 'function') {
            throw new Error('Socket method is not a function and default is not provided');
        }
        return defaultMethod;
    }

    /**
     * The socket factory that checks for a valid event name.
     *
     * @param  {String} eventName - The event name.
     * @param  {...*}             - The additional parameters.
     * @return {Object}           - The socket.
     */
    return function(eventName) {
        if (typeof eventName !== 'string') {
            throw new TypeError('Event name must be a string', eventName);
        }
        return socketMethod.apply({}, arguments);
    };
}

/**
 * Socket reducer.
 *
 * @param  {Object} state={}             - The state.
 * @param  {Object} action               - The action.
 * @param  {String} action.type          - The action type.
 * @param  {Object} [action.socket]      - The socket.
 * @param  {Object} [action.socket.emit] - The socket `emit` method.
 * @param  {Object} [action.socket.on]   - The socket `on` method.
 * @return {Object}                      - The state.
 */
export default function reducer(state = {}, action) {
    const { type, socket } = action;
    switch (type) {
        case SET_SOCKET:
            return {
                emit: socketFactory(socket.emit, state.emit),
                on: socketFactory(socket.on, state.on)
            };

        case REMOVE_ALL:
            return {};

        default:
            return state;
    }
}
