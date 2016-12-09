'use strict';

/**
 * Module dependencies.
 */
require('dotenv').config();
var path = require('path');
var webpack = require('webpack');

var PORT = process.env.WDS_PORT;
var HOST = process.env.IP || 'localhost';
var URL = 'http://' + HOST + ':' + PORT;

/**
 * Development webpack.
 */
module.exports = {
    entry: [
        path.join(__dirname, '../src/main.js'),
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?' + URL
    ],

    output: {
        path: path.join(__dirname, '../build/'),
        filename: 'bundle.js',
        publicPath: URL + '/build'
    },

    debug: true,
    devtool: 'eval-source-map',

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'react-hmre']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    devServer: {
        quiet: true,
        inline: true,
        hot: true,
        host: HOST,
        port: PORT
    }
};
