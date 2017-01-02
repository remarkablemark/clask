'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// constants
const millisecondsInOneDay = 86400000;

/**
 * Marks the messages that start on a new day.
 *
 * @param  {Array}  messages  - The messages.
 * @param  {Number} [start=1] - The starting position.
 * @return {Array}            - The messages.
 */
export function markNewDayMessages(messages, start = 1) {
    const copy = _.slice(messages);
    for (let len = copy.length; start < len; start++) {
        const previous = copy[start - 1];
        const current = copy[start];
        const previousDate = new Date(previous.created);
        const currentDate = new Date(current.created);

        // check that the date is different or
        // the time difference is >= 24 hours
        if (previousDate.getDate() !== currentDate.getDate() ||
            Math.abs(currentDate - previousDate) >= millisecondsInOneDay) {
            current.isNewDay = true;
        }
    }
    return copy;
}
