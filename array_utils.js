'use strict';

var clone = require('underscore').clone;

function moveArrayElementByIndex(array, from, to) {
  if (to !== from) {
    array = clone(array);
    var target = array[from];
    var increment = to < from ? -1 : 1;
    for (var k = from; k !== to; k += increment) {
      array[k] = array[k + increment];
    }
    array[to] = target;
  }
  return array;
}

// TODO: Use findIndex from Underscore 1.7.0
function findIndex(array, predicate) {
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
}

module.exports.moveArrayElementByIndex = moveArrayElementByIndex;
module.exports.findIndex = findIndex;
