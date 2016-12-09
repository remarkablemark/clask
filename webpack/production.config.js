'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var webpack = require('webpack');

/**
 * Production webpack.
 */
module.exports = {
    entry: path.join(__dirname, '../src/main.js'),

    output: {
        path: path.join(__dirname, '../build/'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            output: { comments: false },
            compress: { warnings: false }
        })
    ]
};
