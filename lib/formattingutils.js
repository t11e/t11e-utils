'use strict';

var _ = require('underscore');

function isTrue(value) {
  if (_.isArray(value) && value.length === 1) {
    value = value[0];
  }
  return value === true || value === 'true';
}

function singularOrPlural(value, singular, plural) {
  return value === 1 ? singular : plural;
}

function formatNumberWithCommas(x) {
  return ('' + x).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatNumberAsWord(number) {
  var s = '';
  var numberWords = [
    'none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen'];
  if (number >= 0 && number < numberWords.length) {
    s += numberWords[number];
  } else {
    s += number;
  }
  return s;
}

function capitalizeEachWord(s) {
  return s.split(' ').map(function(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function capitalize(s) {
  if (s.length > 0) {
    return s.slice(0, 1).toUpperCase() + s.slice(1);
  } else {
    return s;
  }
}

function truncateText(s, maxLength) {
  if (s.length > maxLength) {
    s = s.slice(0, maxLength) + '…';
  }
  return s;
}

function parseSquareFeet(s) {
  if (typeof s === 'number') {
    return s;
  } else if (typeof s === 'string' && /^(\d+(\.\d+)?)(\s*sq(\s*ft)?)?$/.test(s.trim())) {
    return parseInt(s);
  }
}

function computeCentroid(latlngs) {
  var lat = 0, lng = 0;
  for (var i = 0; i < latlngs.length; i++) {
    lat += latlngs[i].lat;
    lng += latlngs[i].lng;
  }
  return [lat / latlngs.length, lng / latlngs.length];
}

function zeroPad(s, l) {
  if (s !== null) {
    s = '' + s;
    while (s.length < l) {
      s = '0' + s;
    }
  }
  return s;
}

function ordinalize(v) {
  var s = v.toString();
  var last = s.substring(s.length - 1, 1);
  if (last === '1') {
    return s + 'st';
  } else if (last === '2') {
    return s + 'nd';
  } else if (last === '3') {
    return s + 'rd';
  } else {
    return s + 'th';
  }
}

module.exports = {
  isTrue: isTrue,
  singularOrPlural: singularOrPlural,
  formatNumberWithCommas: formatNumberWithCommas,
  formatNumberAsWord: formatNumberAsWord,
  capitalizeEachWord: capitalizeEachWord,
  capitalize: capitalize,
  truncateText: truncateText,
  parseSquareFeet: parseSquareFeet,
  computeCentroid: computeCentroid,
  zeroPad: zeroPad,
  ordinalize: ordinalize
};
