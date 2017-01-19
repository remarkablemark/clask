'use strict';

/**
 * User-socket id pair.
 * @namespace
 */
let users = {};

/**
 * Connected user ids.
 * @namespace
 */
let connectedUsers = [];

/**
 * Room-users id pair.
 * @namespace
 */
let rooms = {};

/**
 * Saves user-socket id pair.
 *
 * @param {String} userId   - The user id.
 * @param {String} socketId - The socket id.
 */
function setUserSocket(userId, socketId) {
    users[userId] = socketId;
    connectedUsers.push(userId);
}

/**
 * Removes user-socket id pair.
 *
 * @param {String} userId - The user id.
 */
function unsetUserSocket(userId) {
    delete users[userId];
    const index = connectedUsers.indexOf(userId);
    if (index !== -1) {
        connectedUsers.splice(index, 1);
    }
}

/**
 * Adds user id to room.
 *
 * @param {String} roomId - The user id.
 * @param {String} userId - The socket id.
 */
function setRoomUser(roomId, userId) {
    const roomValue = rooms[roomId];
    if (!roomValue || roomValue.constructor !== Array) {
        rooms[roomId] = [];
    }
    rooms[roomId].push(userId);
}

/**
 * Removes user id from room.
 *
 * @param {String} userId - The user id.
 */
function unsetRoomUser(roomId, userId) {
    const roomValue = rooms[roomId];
    if (!roomValue || roomValue.constructor !== Array) {
        rooms[roomId] = [];
        return;
    }
    const index = rooms[roomId].indexOf(userId);
    if (index !== -1) {
        rooms[roomId].splice(index, 1);
    }
}

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
 * Export helpers.
 */
module.exports = {
    // socket debugger
    debug: require('debug')(process.env.APP_NAME + ':socket'),

    // reformat data
    docsToObj,

    // socket helpers
    users,
    connectedUsers,
    rooms,
    setUserSocket,
    unsetUserSocket,
    setRoomUser,
    unsetRoomUser
};
