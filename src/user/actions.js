'use strict';

/**
 * Action types.
 */
export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';

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
