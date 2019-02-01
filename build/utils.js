/** @format */

'use strict';
const path = require('path');
const glob = require('glob');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');

exports.assetsPath = function(_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

// generate loader string to be used with extract text plugin
exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      });
    } else {
      return ['style-loader'].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', { javascriptEnabled: true }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};

exports.createNotifierCallback = function() {
  const notifier = require('node-notifier');

  return function(severity, errors) {
    if (severity !== 'error') {
      return;
    }
    const error = errors[0];

    const filename = error.file && error.file.split('!').pop();
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};

/**
 * 获取单页入口
 *
 * @returns
 */
const getSPAEntry = () => {
  return {
    index: config.disableHMR
      ? config.entry()
      : [
          config.entry(),
          'webpack-hot-middleware/client.js?noInfo=true&reload=true'
        ]
  };
};

/**
 *
 * 获取多页入口
 * @returns
 */
const getEntries = () => {
  const map = {};
  const entryFiles = glob.sync(config.entry(), { matchBase: true });

  for (let i = 0; i < entryFiles.length; i++) {
    const filename = entryFiles[i].substring(
      entryFiles[i].indexOf('views/') + 6,
      entryFiles[i].lastIndexOf('.')
    );
    map[filename] = config.disableHMR
      ? entryFiles[i]
      : [
          entryFiles[i],
          'webpack-hot-middleware/client.js?noInfo=true&reload=true'
        ];
  }

  return map;
};

exports.entry = function() {
  return config.spaMode ? getSPAEntry() : getEntries();
};

/**
 * 根据构建不同输出html视图目录
 * @param {*} name
 */
const generateViewDirectory = name => {
  return (
    (name = name ? name : 'index'), config.viewOutputRoot() + name + '.html'
  );
};

/**
 * 创建单页HTMLPlugin
 */
const createSPAHTMLPlugin = () => {
  return process.env.NODE_ENV == 'development'
    ? [
        new HtmlWebpackPlugin({
          filename: generateViewDirectory(),
          template: 'html-withimg-loader!' + config.htmlTemplate()
        })
      ]
    : [
        new HtmlWebpackPlugin({
          filename: generateViewDirectory(),
          template: 'html-withimg-loader!' + config.htmlTemplate(),
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
          chunksSortMode: 'dependency'
        })
      ];
};

/**
 * 创建多页HTMLPlugin
 */
const createHTMLPlugin = () => {
  const entryHTML = glob.sync(config.entry(), { matchBase: true });
  // const entryHTML = config.htmlTemplate()
  const entriesFiles = exports.entry();
  const plugins = [];

  for (let i = 0; i < entryHTML.length; i++) {
    const filePath = entryHTML[i];
    const filename = filePath.substring(
      filePath.indexOf('views') + 6,
      filePath.lastIndexOf('.')
    );

    const conf = {
      template: 'html-withimg-loader!' + config.htmlTemplate(),
      filename: generateViewDirectory(filename),
      chunks: ['vendor', filename]
    };

    if (process.env.NODE_ENV != 'development') {
      conf.chunksSortMode = 'dependency';
      conf.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      };
    }
    plugins.push(new HtmlWebpackPlugin(conf));
  }
  return plugins;
};

/**
 * 添加html插件
 */
exports.addHTMLPlugin = webpackConfig => {
  const html_plugins = config.spaMode
    ? createSPAHTMLPlugin()
    : createHTMLPlugin();
  for (let i = 0; i < html_plugins.length; i++) {
    webpackConfig.plugins.push(html_plugins[i]);
  }
  return webpackConfig;
};
