'use strict';

/**
 * Action types.
 */
export const SET_SOCKET = 'SET_SOCKET';

/**
 * Action creators.
 */

/**
 * Sets socket.
 *
 * @param  {Object} socket - The socket.
 * @return {Object}        - The dispatch action.
 */
export function setSocket(socket) {
    return {
        type: SET_SOCKET,
        socket
    };
}
