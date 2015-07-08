'use strict';

/**
 * Compute basic hash of string.
 */
function computeStringHash(s) {
  var hash = 5381;
  var i = s.length;
  while (i) {
    hash = (hash * 33) ^ s.charCodeAt(--i);
  }
  return hash >>> 0;
}

module.exports.computeStringHash = computeStringHash;
