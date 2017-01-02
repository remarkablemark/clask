'use strict';

/**
 * Module dependencies.
 */
import _ from 'lodash';

// constants
const millisecondsInOneDay = 86400000;

/**
 * Reformats messages.
 * 1. Convert `created` into a Date object.
 * 2. Mark the messages the start on a new day.
 *
 * @param  {Array}  messages  - The messages.
 * @param  {Number} [start=0] - The starting position.
 * @return {Array}            - The reformatted messages.
 */
export function reformatMessages(messages, start = 0) {
    // make a copy of messages
    const copy = _.slice(messages);

    for (let len = copy.length; start < len; start++) {
        const current = copy[start];

        // convert to Date object
        if (!_.isDate(current.created)) {
            current.created = new Date(current.created);
        }

        // start marking for new day on the 2nd message
        if (start) {
            const previous = copy[start - 1];
            const currentDate = current.created;
            const previousDate = previous.created;

            // check that the date is different or
            // the time difference is >= 24 hours
            if (previousDate.getDate() !== currentDate.getDate() ||
                Math.abs(currentDate - previousDate) >= millisecondsInOneDay) {
                current.isNewDay = true;
            }
        }
    }
    return copy;
}
