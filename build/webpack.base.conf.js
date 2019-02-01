/** @format */

'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const pathMap = require('../pathmap.json');
const autoprefixer = require('autoprefixer');
const packageJson = require('../package.json');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        fix: true
    }
});

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: utils.entry(),
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath,
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    resolve: {
        extensions: [
            '.js',
            '.vue',
            '.css',
            '.scss',
            '.tpl',
            '.png',
            '.jpg',
            '.html',
            '.ejs',
            '.less'
        ],
        modules: ['./src', './src/components', './src/views', './node_modules'],
        alias: Object.assign({}, pathMap, {
            '@': path.join(__dirname, '..', 'src'),
            'jgpt$': path.join(__dirname, '..', 'src', 'smart-assistant-jgpt')
        })
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.(png|jpg|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false,
                    postcss: [autoprefixer({ browsers: packageJson.browserslist })]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    resolve('src'),
                    resolve('test'),
                    resolve('node_modules/webpack-dev-server/client')
                ]
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader',
                include: [
                    resolve('src'),
                    resolve('node_modules/webpack-dev-server/client')
                ]
            }
        ]
    }
};