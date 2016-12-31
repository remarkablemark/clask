'use strict';

/**
 * Shim for getting the time.
 *
 * @return {Number} - The UTC timestamp in milliseconds.
 */
export const getTime = (
    typeof Date.now === 'function' ?
    Date.now :
    () => new Date().getTime()
);
