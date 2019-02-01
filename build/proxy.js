/** @format */

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxy({});

module.exports = function(options) {
  if (typeof options === 'string') {
    options = {
      target: options,
      secure: false
    };
  }
  return function(req, res, next) {
    req.url = req.originalUrl;
    console.log('proxy: ', req.url);
    proxy.web(req, res, options, function(err) {
      err.mod = 'proxy';
      next(err);
    });
  };
};
