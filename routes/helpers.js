'use strict';

/**
 * Reformats users array to an id-based object.
 *
 * @param  {Array}  users - The users.
 * @return {Object}
 */
function reformatUsers(users) {
    const usersObj = {};
    users.forEach((user) => {
        usersObj[user._id] = user;
        // exclude redundant `_id`
        usersObj[user._id]._id = undefined;
    });
    return usersObj;
}

module.exports = {
    reformatUsers
};
