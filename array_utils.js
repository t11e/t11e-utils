'use strict';

import {clone} from 'underscore';

export function moveArrayElementByIndex(array, from, to) {
  if (to !== from) {
    array = clone(array);
    const target = array[from];
    const increment = to < from ? -1 : 1;
    for (let k = from; k !== to; k += increment) {
      array[k] = array[k + increment];
    }
    array[to] = target;
  }
  return array;
}

// TODO: Use findIndex from Underscore 1.7.0
export function findIndex(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
}
