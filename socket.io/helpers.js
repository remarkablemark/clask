'use strict';

/**
 * Reformats documents to a key-based object.
 *
 * @param  {Array}  docs  - The docs.
 * @param  {String} [key] - The key.
 * @return {Object}
 */
function docsToObj(docs, key = '_id') {
    const result = {};
    docs.forEach((doc) => {
        const value = doc[key];
        result[value] = doc.toObject();
        // exclude redundant key
        result[value][key] = undefined;
    });
    return result;
}

/**
 * Finds socket that matches criteria.
 *
 * @param  {Object}   sockets - The sockets.
 * @param  {Function} match   - The match checker.
 * @return {(Object|undefined)}
 */
function findSocket(sockets, match) {
    for (let socketId in sockets) {
        const socket = sockets[socketId];
        if (match(socket)) return socket;
    }
}

/** Socket debugger. */
const debug = require('debug')(process.env.APP_NAME + ':socket');

module.exports = {
    debug,
    docsToObj,
    findSocket
};
