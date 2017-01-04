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
 * @param  {Number} [end]     - The end position.
 * @return {Array}            - The reformatted messages.
 */
export function reformatMessages(messages, start = 0, end) {
    end = end || messages.length;

    // make a deep copy of messages to prevent mutations
    const copy = _.cloneDeep(messages);

    // check if starting message is the first message of the channel
    if (start === 0 && copy[start].isFirst) {
        copy[start].isNewDay = true;
    }

    for (; start < end; start++) {
        const current = copy[start];

        // convert to Date object
        if (!_.isDate(current.created)) {
            current.created = new Date(current.created);
        }

        // start marking on the 2nd message
        if (start > 0) {
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

/**
 * Formats date to time string.
 *
 * @param  {Date}   date - The date.
 * @return {String}      - The formatted time.
 */
export function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = [];

    // hours: 1-12
    if (hours > 12) {
        time.push(hours - 12);
    } else if (hours > 0) {
        time.push(hours);
    } else if (hours === 0) {
        time.push(12);
    }

    // separator
    time.push(':');

    // minutes: 01-59
    time.push(minutes > 9 ? minutes : '0' + minutes);

    // period: AM or PM
    time.push(hours > 12 ? ' PM' : ' AM');

    // time: MM:SS PD
    return time.join('');
}

/**
 * Formats date to date string.
 *
 * @param  {Date}   date - The date.
 * @return {String}      - The formatted date.
 */
export function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return [month, day, year].join('/');
}
