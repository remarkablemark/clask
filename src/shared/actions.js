'use strict';

/**
 * Shared action types.
 */
export const REMOVE_ALL = 'SHARED_REMOVE_ALL';

/**
 * Action creators.
 */

/**
 * Removes all data.
 *
 * @return {Object} - The dispatch action.
 */
export function removeAll() {
    return {
        type: REMOVE_ALL
    };
}
