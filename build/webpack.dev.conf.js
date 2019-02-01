/** @format */

'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: false
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新
    new webpack.NamedModulesPlugin(), // 更新组件时在控制台输出组件的路径
    new webpack.NoEmitOnErrorsPlugin(), // 跳过输出
    new ExtractTextPlugin({
      filename: utils.assetsPath('styles/[name].[contenthash].css'),
      allChunks: false
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, '../', 'mock'),
    //     to: path.resolve(__dirname, '../dist/', 'mock')
    //   },
    //   {
    //     from: path.resolve(__dirname, '../src/', 'assets'),
    //     to: path.resolve(__dirname, '../dist/', 'assets'),
    //     ignore: ['.*']
    //   }
    // ]),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
});

//添加webpack html plugin
devWebpackConfig = utils.addHTMLPlugin(devWebpackConfig);

module.exports = devWebpackConfig;
