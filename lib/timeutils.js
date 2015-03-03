'use strict';

var formattingutils = require('./formattingutils');

var weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

/*
 * Takes a date, returning the same date at 00:00.
 */
function atBeginningOfDate(date) {
  var d = new Date();
  d.setDate(date.getDate());
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

/**
 * Tests if two dates are equal.
 */
function isDateEqual(a, b) {
  return (
    a instanceof Date &&
    b instanceof Date &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Add days (positive or negative) to a date.
 */
function addDateDays(date, days) {
  var d = new Date(date.getTime());
  d.setDate(date.getDate() + days);
  return d;
}

/**
 * Format a date verbosely (day, month, possibly year).
 */
function formatVerboseDate(date) {
  var today = new Date();
  var result = weekDayNames[date.getDay()] + ', ' +
    monthNames[date.getMonth()] + ' ' +
    date.getDate();
  if (date.getFullYear() !== today.getFullYear()) {
    result += ' ' + date.getFullYear();
  }
  return result;
}

/**
 * Format a date informally (eg., 'today'). Handles future dates, too.
 * Reverts to full verbose format beyond a certain distance.
 */
function formatInformalRelativeDate(date, relativeToDate) {
  relativeToDate || (relativeToDate = new Date());

  // Cover for the egde case where a human is reading the date around or
  // after midnight and the definition of "today" and "tomorrow" becomes
  // fuzzy. For now, we just avoid being informal within this hour range.
  var relativeHour = relativeToDate.getHours();
  var isFuzzy =
    (relativeHour >= 0 && relativeHour <= 4) ||
    (relativeHour === 23 && relativeToDate.getMinutes() >= 55);
  if (!isFuzzy) {
    if (isDateEqual(date, relativeToDate)) {
      return 'today';
    } else if (isDateEqual(date, addDateDays(relativeToDate, 1))) {
      return 'tomorrow';
    } else if (isDateEqual(date, addDateDays(relativeToDate, -1))) {
      return 'yesterday';
    }
  }

  return formatVerboseDate(date);
}

/**
 * Formats time as "3 pm" or "9:42 am".
 */
function formatAMPMTime(hours, minutes) {
  var m = minutes !== 0 ? (':' + formattingutils.zeroPad(minutes, 2)) : '';
  var h = (hours % 12) === 0 ? 12 : (hours % 12);
  if (hours < 12) {
    return h + m + ' am';
  } else {
    return h + m + ' pm';
  }
}

/**
 * Format a clock time approximately.
 */
function formatInformalTime(date) {
  var hours = date.getHours() + Math.round(date.getMinutes() / 60.0);
  if (hours === 0) {
    return 'around midnight';
  } else {
    var minutes = date.getMinutes();
    return formatAMPMTime(hours, minutes);
  }
}

/**
 * Format a date time's relative, approximate distance to this moment.
 * Reverts to full verbose format beyond a certain distance.
 */
function formatInformalRelativeDateTime(date) {
  var now = new Date().getTime();
  var distanceInSeconds = Math.round((now - date.getTime()) / 1000);
  if (distanceInSeconds < 60) {
    return 'just now';
  }
  if (distanceInSeconds > 86400 * 3) {
    return formatVerboseDate(date) + ' at ' + formatInformalTime(date);
  }
  var distanceInMinutes = Math.round(distanceInSeconds / 60);
  var s = '';
  if (distanceInMinutes <= 1) {
    s += 'one minute';
  } else if (distanceInMinutes <= 14) {
    s += formattingutils.formatNumberAsWord(distanceInMinutes) + ' minutes';
  } else if (distanceInMinutes <= 39) {
    s += 'half an hour';
  } else if (distanceInMinutes <= 90) {
    s += 'an hour';
  } else if (distanceInMinutes <= 1440) {
    s += formattingutils.formatNumberAsWord(Math.round(distanceInMinutes / 60.0)) + ' hours';
  } else if (distanceInMinutes <= 2880) {
    return 'yesterday';
  } else {
    s += formattingutils.formatNumberAsWord(Math.round(distanceInMinutes / 1440.0)) + ' days';
  }
  s += ' ago';
  return s;
}

module.exports = {
  formatAMPMTime: formatAMPMTime,
  formatVerboseDate: formatVerboseDate,
  formatInformalTime: formatInformalTime,
  formatInformalRelativeDate: formatInformalRelativeDate,
  formatInformalRelativeDateTime: formatInformalRelativeDateTime,
  atBeginningOfDate: atBeginningOfDate,
  addDateDays: addDateDays,
  isDateEqual: isDateEqual
};
