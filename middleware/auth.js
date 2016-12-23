'use strict';

/**
 * Authorization middleware.
 *
 * @param {Object}   req  - The request.
 * @param {Object}   res  - The response.
 * @param {Function} next - The callback.
 */
module.exports = function(req, res, next) {
    // authenticated
    if (req.session.isAuthenticated) return next();

    // unauthenticated
    res.status(401).json({
        message: 'Unauthorized.'
    });
};
