'use strict';

/**
 * Module dependencies.
 */
var socket = require('socket.io');
var debug = require('debug')('express-template:socket');

/**
 * Export Socket.IO.
 */
module.exports = function(server) {
    var io = socket(server);

    // client connected
    io.on('connection', function(socket) {
        debug('Connected');

        socket.on('disconnect', function() {
            debug('Disconnected');
        });
    });
};
