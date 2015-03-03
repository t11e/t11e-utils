'use strict';

import expect from 'expect.js';

import {
  formatInformalRelativeDate,
  formatVerboseDate
} from '../lib/timeutils';

function makeLocalDate(year, month, day, hour, min) {
  let d = new Date();
  d.setFullYear(year);
  d.setMonth(month);
  d.setDate(day);
  d.setHours(hour || 0, min || 0, 0, 0);
  return d;
}

describe('timeutils', function() {

  beforeEach(function() {
    this.timeout(5000);
  });

  describe('#formatInformalRelativeDate()', function() {

    function dateTests(date, expectString) {
      it('returns "today" when time is not fuzzy', function() {
        for (let hour = 5; hour <= 23; hour++) {
          for (let minute = 0; minute < (hour === 23 ? 55 : 60); minute++) {
            let now = makeLocalDate(2014, 10, 18, hour, minute);
            expect(
              formatInformalRelativeDate(date, now))
              .to.eql(expectString);
          }
        }
      });

      it('returns verbose date when 23:55 <= time < 05:00', function() {
        for (let minute = 55; minute <= 59; minute++) {
          let now = makeLocalDate(2014, 10, 18, 23, minute);
          expect(
            formatInformalRelativeDate(date, now))
            .to.eql(formatVerboseDate(date));
        }
        for (let hour = 0; hour <= 4; hour++) {
          for (let minute = 0; minute <= 59; minute++) {
            let now = makeLocalDate(2014, 10, 18, hour, minute);
            expect(
              formatInformalRelativeDate(date, now))
              .to.eql(formatVerboseDate(date));
          }
        }
      });
    }

    describe('when same date', function() {
      dateTests(makeLocalDate(2014, 10, 18), 'today');
    });

    describe('when day after date', function() {
      dateTests(makeLocalDate(2014, 10, 19), 'tomorrow');
    });

    describe('when day before date', function() {
      dateTests(makeLocalDate(2014, 10, 17), 'yesterday');
    });

  });

});
