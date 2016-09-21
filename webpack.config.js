/**
 * webpack开发配置文件
 */

'use strict';

const path = require('path');
const _ = require('underscore');
const webpack = require('webpack');
const isProduction = (process.env.NODE_ENV == 'production') ? true : false;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const source_dir = path.resolve(__dirname, 'src');
const dist_dir = path.resolve(__dirname, (isProduction ? 'dist' : 'build'));
const hash = false;

//phaser
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split' + (isProduction ? '.min.' : '.') + 'js');
const pixi = path.join(phaserModule, 'build/custom/pixi' + (isProduction ? '.min.' : '.') + 'js');
const p2 = path.join(phaserModule, 'build/custom/p2' + (isProduction ? '.min.' : '.') + 'js');

const plugins = [
    new HtmlWebpackPlugin({
        title: 'phaser-demo',
        template: path.resolve(__dirname, 'src/ejs/index.ejs')
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors' + (isProduction ? '.min.' : '.') + (hash ? '[hash].js' : 'js')),
    new ExtractTextPlugin('style.css', {
        allChunks: true
    })
];
if (isProduction) {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': 'production'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin()
    );
}

module.exports = {
    entry: {
        polyfill: ['babel-polyfill'],
        app: [path.resolve(__dirname, 'src/app.js')],
        vendors: ['node-uuid', 'object-assign', 'qs', 'underscore', 'moment']
    },
    output: {
        path: dist_dir,
        filename: '[name]' + (isProduction ? '.min.' : '.') + (hash ? '[hash].js' : 'js')
    },
    module: {
        loaders: [
            {test: /pixi(.min)?.js/, loader: "script"},
            {test: /p2(.min)?.js/, loader: "script"},
            {test: /phaser-split(.min)?.js/, loader: "script"},
            {
                test: /\.js$/,
                loader: 'babel',
                include: source_dir,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-3'],
                    compact: false
                }
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less-loader!postcss-loader')
            },
            {test: /\.json$/, include: source_dir, exclude: /node_modules/, loader: 'json'},
            {test: /\.png$/, loader: 'url?limit=8192&mimetype=image/png'},
            {test: /\.jpe?g$/, loader: 'url?limit=8192&mimetype=image/jpg'},
            {test: /\.gif$/, loader: 'url?limit=8192&mimetype=image/gif'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=image/svg+xml'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff2'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=8192&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'}
        ]
    },
    plugins: plugins,
    resolve: {
        root: path.resolve('src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js'],
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    },
    externals: {}
};
