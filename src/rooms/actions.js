'use strict';

/**
 * Action types.
 */
export const SET_ROOMS = 'SET_ROOMS';

/**
 * Action creators.
 */

/**
 * Sets rooms data.
 *
 * @param  {Object} rooms - The rooms data.
 * @return {Object}       - The dispatch action.
 */
export function setRooms(rooms) {
    return {
        type: SET_ROOMS,
        rooms
    };
}
