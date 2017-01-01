'use strict';

/**
 * Action types.
 */
export const APPEND_MESSAGES = 'APPEND_MESSAGES';
export const PREPEND_MESSAGES = 'PREPEND_MESSAGES';

/**
 * Action creators.
 */

/**
 * Appends messages.
 *
 * @param  {String} room - The room id.
 * @param  {Array}       - The messages.
 * @return {Object}      - The dispatch action.
 */
export function appendMessages(room, messages) {
    return {
        type: APPEND_MESSAGES,
        room,
        messages
    };
}

/**
 * Prepends messages.
 *
 * @param  {String} room - The room id.
 * @param  {Array}       - The messages.
 * @return {Object}      - The dispatch action.
 */
export function prependMessages(room, messages) {
    return {
        type: PREPEND_MESSAGES,
        room,
        messages
    };
}
