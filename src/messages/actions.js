'use strict';

/**
 * Action types.
 */
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES';

/**
 * Action creators.
 */

/**
 * Adds or updates messages.
 *
 * @param  {String} roomId   - The room id.
 * @param  {Array}  messages - The messages.
 * @return {Object}          - The dispatch action.
 */
export function updateMessages(roomId, messages) {
    return {
        type: UPDATE_MESSAGES,
        roomId,
        messages
    };
}
