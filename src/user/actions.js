'use strict';

/**
 * Action types.
 */
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const REMOVE_USER = 'REMOVE_USER';

/**
 * Action creators.
 */

/**
 * Sets the user authentication value.
 *
 * @param  {Boolean} isAuthenticated - The authentication value.
 * @return {Object}                  - The dispatch action.
 */
export function setAuthentication(isAuthenticated) {
    return {
        type: SET_AUTHENTICATION,
        isAuthenticated
    };
}

/**
 * Removes the user.
 *
 * @return {Object} - The dispatch action.
 */
export function removeUser() {
    return {
        type: REMOVE_USER
    };
}
