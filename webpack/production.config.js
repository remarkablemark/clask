'use strict';

/**
 * Module dependencies.
 */
const path = require('path');
const webpack = require('webpack');

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
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ],

    externals: {
        'lodash': '_',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'react-redux': 'ReactRedux',
        'redux': 'Redux'
    }
};
