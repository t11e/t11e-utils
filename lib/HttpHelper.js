'use strict';

var _ = require('underscore');
var Promise = require('bluebird');
var http = require('http');
var urlParse = require('url').parse;
var urlResolve = require('url').resolve;

function parseUrl(url) {
  if (typeof window !== undefined) {
    if (/^\/\//.test(url)) {
      url = (window.location ? window.location.protocol : 'http:') + url;
    } else if (/^\//.test(url) && window.location) {
      url = urlResolve(window.location.href, url);
    }
  }

  var parsed = urlParse(url);
  if (!(parsed.host && parsed.path)) {
    throw new Error("Invalid URL: " + url);
  }
  return parsed;
}

function request(method, url, options) {
  var location = parseUrl(url);

  var headers = (options && options.headers) ? _.clone(options.headers) : {};

  var query = options.query;
  if (typeof query === 'object' &&
    (location.query === null || location.query === '')) {
    location.path = location.pathname + '?' + _.map(query, function(v, k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(v);
    }).join('&');
  }

  var data = options.data;
  if (typeof data === 'object' && (!headers['Content-Type'] ||
    headers['Content-Type'] === 'application/json')) {
    data = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  if (!location.protocol) {
    if (typeof window !== undefined && window.location) {
      location.protocol = window.location.protocol === 'file:' ? 'http:' :
        window.location.protocol;
    } else {
      location.protocol = 'http:';
    }
  }

  return new Promise(function(resolve, reject) {
    var req = http.request({
      path: location.path,
      host: location.host,
      port: location.port,
      protocol: location.protocol,
      method: method,
      headers: headers,
      withCredentials: options.withCredentials || false
    }, function(res) {
      var buffer = '';
      if (res.statusCode !== 200) {
        reject("Request to " + url + " failed with " + res.statusCode);
        return;
      }
      res.on('data', function(chunk) {
        buffer += chunk;
      });
      res.on('error', function(err) {
        reject(err);
      });
      res.on('end', function() {
        var result = buffer;
        var contentType = res.getHeader('content-type');
        if (contentType.indexOf('application/json') !== -1) {
          try {
            result = JSON.parse(result);
          } catch (err) {
            reject("Could not parse response body as JSON: " + err);
            return;
          }
        }
        resolve([result, res]);
      });
    });
    req.on('error', function(err) {
      reject(err);
    });
    if (req.socket) {
      req.socket.setTimeout(10 * 1000);
    }
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

module.exports.post = function(url, options) {
  return request('POST', url, options);
};

module.exports.get = function(url, options) {
  return request('GET', url, options);
};
