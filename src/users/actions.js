'use strict';

/**
 * Action types.
 */
export const SET_USERS = 'SET_USERS';

/**
 * Action creators.
 */

/**
 * Sets users data.
 *
 * @param  {Object} users - The users data.
 * @return {Object}       - The dispatch action.
 */
export function setUsers(users) {
    return {
        type: SET_USERS,
        users
    };
}
