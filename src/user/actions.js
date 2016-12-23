'use strict';

/**
 * Action types.
 */
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';

/**
 * Action creators.
 */

/**
 * Sets the user authentication value.
 *
 * @param  {Boolean} isAuthentication - The authentication value.
 * @return {Object}                   - The dispatch action.
 */
export function setAuthentication(isAuthenticated) {
    return {
        type: SET_AUTHENTICATION,
        isAuthenticated
    };
}
