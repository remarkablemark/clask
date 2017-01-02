'use strict';

/**
 * Action types.
 */
export const SET_USER = 'SET_USER';

/**
 * Action creators.
 */

/**
 * Sets user data.
 *
 * @param  {Object} user - The user data.
 * @return {Object}      - The dispatch action.
 */
export function setUser(user) {
    return {
        type: SET_USER,
        user
    };
}
