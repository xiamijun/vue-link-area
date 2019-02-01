/** @format */

'use strict';

var path = require('path');

module.exports = {
  // 是否单页模式
  spaMode: true,
  // 构建输出环境 {'JAVA', 'NODE'}
  buildEnv: 'NODE',
  // 入口文件
  entry: function() {
    return this.spaMode ? './src/index.js' : './src/views/**/*.js';
  },
  // html模板文件
  htmlTemplate: function() {
    return this.spaMode ? 'index.html' : './src/views/**/*.html';
  },
  // 视图输出总目录
  viewOutputRoot: function() {
    return this.buildEnv === 'JAVA'
      ? 'WEB-INF/views/'
      : this.spaMode
        ? ''
        : 'views/';
  },
  // 禁用热替换
  disableHMR: process.env.NODE_ENV === 'production' ? true : false,
  // 开发配置
  dev: {
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 静态资源文件夹
    assetsSubDirectory: 'assets',
    // 发布路径
    assetsPublicPath: '/',
    // Various Dev Server settings
    host: 'localhost',
    // dev-server监听的端口
    port: 8081,
    cssSourceMap: false,
    devtool: 'cheap-module-eval-source-map',
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false
  },
  // 构建配置
  build: {
    // 存放根路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 二级目录，存放静态资源文件的目录，位于dist文件夹下
    assetsSubDirectory: 'assets',
    // 发布路径，设置之后构建的产品文件在注入到index.html中的时候就会带上这里的发布路径
    assetsPublicPath: '/',
    // 是否使用source-map
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'cheap-source-map',
    // 是否开启gzip压缩
    productionGzip: false,
    // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否展示webpack构建打包之后的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
