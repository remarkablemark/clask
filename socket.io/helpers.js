'use strict';

/**
 * Users.
 * @namespace
 */
let users = {
    // [userId]: {
    //     socket: String,
    //     rooms: Array
    // }
};

/**
 * Gets users.
 *
 * @return {Object}
 */
function getUsers() {
    return users;
}

/**
 * Gets user from users.
 *
 * @param  {String} userId - The user id.
 * @return {Object}
 */
function getUser(userId) {
    return users[userId];
}

/**
 * Deletes user from users.
 *
 * @param {String} userId - The user id.
 */
function removeUser(userId) {
    delete users[userId];
}

/**
 * Sets socket id in users.
 *
 * @param {String} userId   - The user id.
 * @param {String} socketId - The socket id.
 */
function setUserSocket(userId, socketId) {
    let user = getUser(userId);
    if (!user) {
        user = { rooms: [] };
        users[userId] = user;
    }
    user.socket = socketId;
}

/**
 * Adds room id to users.
 *
 * @param {String} userId - The user id.
 * @param {String} roomId - The room id.
 */
function addUserRoom(userId, roomId) {
    let user = getUser(userId);
    if (!user) {
        user = { rooms: [] };
        users[userId] = user;
    }
    user.rooms.push(userId);
}

/**
 * Removes room id from users.
 *
 * @param {String} userId - The user id.
 * @param {String} roomId - The room id.
 */
function removeUserRoom(userId, roomId) {
    let user = getUser(userId);
    if (!user || !user.rooms) return;
    const index = user.rooms.indexOf(roomId);
    if (index !== -1) {
        user.rooms.splice(index, 1);
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
    getUsers,
    getUser,
    setUserSocket,
    addUserRoom,
    removeUserRoom,
    removeUser
};
