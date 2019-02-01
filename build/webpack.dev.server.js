/** @format */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.dev.conf');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const history = require('connect-history-api-fallback');
const proxy = require('./proxy');
const proxyurl = 'http://server.host:8081';

const PORT = config.dev.port,
    HOST = config.dev.host,
    DIST_DIR = path.join(config.dev.assetsRoot, config.viewOutputRoot()),
    app = express(),
    router = express.Router(),
    complier = webpack(
        merge(baseWebpackConfig, {
            devtool: 'eval-source-map'
        })
    );

// webpack-dev-server中间件
const devMiddleware = webpackDevMiddleware(complier, {
    publicPath: baseWebpackConfig.output.publicPath,
    quiet: false,
    stats: {
        colors: true,
        chunks: false
    }
});

app.use(history());
app.use(devMiddleware);
app.use(webpackHotMiddleware(complier));
app.use('/views', express.static(path.join(config.dev.assetsRoot, 'views')));
app.use('/assets', express.static(path.join(config.dev.assetsRoot, 'assets')));

// 代理真实的URL地址
app.use('/xiaozhi-back-api/*', proxy(proxyurl));

app.use(router);

// favicon
router.get('/favicon.ico', (req, res, next) => {
    res.end();
});

// 根路由
router.get('/', (req, res, next) => {
    config.spaMode ?
        sendFile(path.join(DIST_DIR, '/index.html'), res, next) :
        sendFile(path.join(DIST_DIR, 'index.html'), res, next);
});

router.get('/views', (req, res, next) => {
    sendFile(path.join(DIST_DIR, 'index.html'), res, next);
});

// 一级路由
router.get('/:view', (req, res, next) => {
    sendFile(path.join(DIST_DIR, req.params.view + '/index.html'), res, next);
});

// mock数据
router.get('/mock/:module', (req, res, next) => {
    sendFile(
        path.join(DIST_DIR + '../mock/' + req.params.module + '.json'),
        res,
        next,
        true
    );
});

// 二级路由
router.get('/:module/:view', (req, res, next) => {
    sendFile(
        path.join(
            DIST_DIR,
            req.params.module + '/' + req.params.view + '/index.html'
        ),
        res,
        next
    );
});

const sendFile = (viewname, response, next, isJSON) => {
    complier.outputFileSystem.readFile(viewname, (err, result) => {
        if (err) {
            response.status(404).send('404');
            return;
        }
        response.set('content-type', isJSON ? 'application/json' : 'text/html');
        response.send(result);
        response.end();
    });
};

module.exports = app.listen(PORT, err => {
    if (err) {
        return;
    }
    console.log(`Listening at http://${HOST}:${PORT}\n`);
});