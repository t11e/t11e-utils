'use strict';

var LZString = require('lz-string');
var _ = require('underscore');

function simpleEncodeUri(value) {
  return value
    .replace('+', '%2b')
    .replace(' ', '%20')
    .replace(',', '%2c');
}

function simpleDecodeUri(value) {
  return decodeURIComponent(value);
}

function toBase64(value) {
  return LZString.compressToBase64(JSON.stringify(value))
    .replace(/=+$/, '');
}

function fromBase64(base64) {
  try {
    return JSON.parse(LZString.decompressFromBase64(base64));
  } catch (e) {
    console.error(e);
    console.error("Value was", base64);
    return null;
  }
}

// Serializes a canonical key/value as a query string key/value:
//
// * A null value is ignored.
// * An empty array is ignored.
// * Arrays and hashes (maps) become encoded as k:b=Base64(JSON(value)).
// * Leaflet geometry becomes encoded as k:polygon=Base64(JSON(latlngs)).
// * A hash `{id: i, value: v}` becomes `k:o=i:v` (`o` meaning object).
// * All other values become `k=v` where v is stringified with `toString()`.
//
function serializeKeyValue(entry) {
  if (_.isArray(entry.value)) {
    if (entry.value.length > 0) {
      return {
        name: entry.name + ':b',
        value: toBase64(entry.value)
      };
    }
  } else if (entry.value && typeof entry.value !== 'undefined') {
    if (entry.value.id && entry.value.name) {
      return {
        name: entry.name + ':o',
        value: simpleEncodeUri(entry.value.id + ':' + entry.value.name)
      };
    } else {
      return {
        name: entry.name,
        value: simpleEncodeUri(entry.value.toString())
      };
    }
  }
  return null;
}

// Deserializes parameter serialized with `serialize()`.
function deserializeKeyValue(entry) {
  if (entry.value && entry.value != '') {
    if (/:l$/.test(entry.name)) {
      // REMOVEME: Old format, only read for backwards compatibility,
      //   safely removed after letting run in production a few weeks.
      return {
        name: entry.name.replace(/:l$/, ''),
        value: _.compact(_.map(value.split(','), function(s) {
          if (s.length > 0) {
            return deserializeKeyValue({name: name, value: s}).value;
          } else {
            return null;
          }
        }))
      };
    } else if (/:b$/.test(entry.name)) {
      return {
        name: entry.name.replace(/:b$/, ''),
        value: fromBase64(entry.value)
      };
    } else if (/:o$/.test(entry.name)) {
      var objectMatch = /^([^:]+):(.+)$/g.exec(entry.value);
      if (objectMatch) {
        return {
          name: entry.name,
          value: {id: objectMatch[0], name: simpleDecodeUri(objectMatch[1])}
        };
      }
    } else {
      return {
        name: entry.name,
        value: simpleDecodeUri(entry.value)
      };
    }
  }
  return null;
}

module.exports.deserialize = function(string) {
  var result = {};
  if (string && string !== '-') {
    _.each(string.split('&'), function(kv) {
      var name = kv.split('=')[0];
      if (name.substring(0, 1) !== '_') {
        var value = kv.split('=')[1];
        var raw = {name: name, value: value};
        var kv = deserializeKeyValue(raw);
        if (kv && kv.value) {
          result[kv.name] = kv.value;
        }
      }
    });
  }
  return result;
};

module.exports.serialize = function(attributes) {
  var s = null;
  _.each(_.pairs(attributes), function(kv) {
    var kv = {name: kv[0], value: kv[1]};
    if (kv.name.substring(0, 1) !== '_') {
      var serialized = serializeKeyValue(kv);
      if (serialized && serialized.value) {
        if (s) {
          s += '&';
        } else {
          s = '';
        }
        s += serialized.name + '=' + serialized.value;
      }
    }
  });
  return s || '-';
};
