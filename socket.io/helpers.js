'use strict';

/** User key constants. */
const USER_KEY_SOCKET = 'socketId';
const USER_KEY_ROOM = 'activeRoomId';

/**
 * Users.
 * @namespace
 */
let users = {
    // [userId]: {
    //     socketId: String,
    //     activeRoomId: String
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
function delUser(userId) {
    delete users[userId];
}

/**
 * Sets properties to user.
 *
 * @param {String} userId   - The user id.
 * @param {Object} property - The property.
 */
function setUser(userId, property = {}) {
    let user = getUser(userId);
    if (!user) {
        users[userId] = user = {};
    }
    Object.assign(user, property);
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

    // constants
    USER_KEY_SOCKET,
    USER_KEY_ROOM,

    // socket helpers
    getUsers,
    getUser,
    setUser,
    delUser
};
