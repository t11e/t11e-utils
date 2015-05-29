'use strict';

import moment from 'moment';
import 'moment-range';

/**
 * Clamps `range` to `within`, so that if the result range is within `within`.
 * Returns `null` if range is entirely outside.
 */
export function clampTimeRange(range, within) {
  if (within) {
    if (range.overlaps(within)) {
      let start = range.start < within.start ?
        range.start > within.end ?
          within.end :
          within.start : range.start;
      let end = range.end > within.end ?
        range.end < within.start ?
          within.start :
          within.end : range.end;
      if (start > end) {
        [start, end] = [end, start];
      }
      return moment.range(start, end);
    } else {
      return null;
    }
  } else {
    return range;
  }
}

/**
 * Given a date and a `unit`, returns a range that corresponds to that unit
 * relative to the date. For example, `year` returns range corresponding to
 * that date's year.
 */
export function expandDateToRange(date, unit) {
  return moment.range(
    moment(date).startOf(unit),
    moment(date).startOf(unit).add(1, unit));
}

/**
 * Returns true if a range's start and end dates fall on the exact start
 * and end dates of the given unit. Eg.,
 * `isRangeWhole(moment.range(moment("2014-01-01"), moment("2015-01-01")))`
 * returns true, whereas
 * `isRangeWhole(moment.range(moment("2014-01-01"), moment("2015-01-02")))`
 * doesn't.
 */
export function isRangeWhole(range, unit) {
  return range.isSame(expandDateToRange(range.start, unit));
}

const RANGE_SEPARATOR = '–';

/**
 * Returns a succinct description of a time range.
 */
export function describeTimeRange(range) {
  if (!range) {
    return 'All time';
  } else if (+range === 60 * 60 * 1000) {
    let now = moment();
    if (range.start.isSame(now, 'year')) {
      return range.start.format('MMM D hh:mm');
    } else {
      return range.start.format('lll');
    }
  } else if (isRangeWhole(range, 'day')) {
    let now = moment();
    if (range.start.isSame(now, 'year')) {
      return range.start.format('MMM D');
    } else {
      return range.start.format('ll');
    }
  } else if (isRangeWhole(range, 'year')) {
    return range.start.format('YYYY');
  } else if (isRangeWhole(range, 'month')) {
    return range.start.format('MMMM, YYYY');
  } else {
    const dates = [range.start, moment(range.end).subtract(1, 'second')];
    let format;
    let s = '';
    if (range.start.isSame(range.end, 'year')) {
      if (range.start.isSame(range.end, 'month')) {
        s += dates[0].format('MMM') + ' ';
        format = 'D';
      } else {
        format = 'MMM D';
      }
    } else {
      format = 'MMM D, YYYY';
    }
    s += dates.map(d => d.format(format)).join(RANGE_SEPARATOR);
    return s;
  }
}
