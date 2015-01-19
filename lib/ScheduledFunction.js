'use strict';

/**
 * Initialize scheduled function. This wraps function `fn`.
 */
var ScheduledFunction = function(fn) {
  this._fn = fn;
  this._scheduledId = null;
};

ScheduledFunction.prototype = {

  /**
   * Stop function, if scheduled.
   */
  stop: function() {
    if (this._repeating && this._scheduledIntervalId) {
      window.clearInterval(this._scheduledIntervalId);
      this._scheduledIntervalId = null;
      return true;
    } else if (this._scheduledId) {
      window.clearTimeout(this._scheduledId);
      this._scheduledId = null;
      return true;
    } else {
      return false;
    }
  },

  /**
   * Schedules function at regular intervals. Function should
   * return false to stop the interval.
   */
  scheduleEvery: function(interval) {
    if (!this._scheduledIntervalId) {
      this._scheduledIntervalId = window.setInterval(function() {
        if (this._fn() === false) {
          this.stop();
        }
      }.bind(this), interval);
      this._repeating = true;
    }
    return this;
  },

  /**
   * Schedule the function to run after a delay. If already scheduled,
   * this will cancel the previous scheduling and then re-schedule.
   * Does not interfere with interval-based schedule.
   */
  schedule: function(delay) {
    var self = this;
    var id = new Date().getTime();
    window.setTimeout(function() {
      if (self._scheduledId === id) {
        self._fn();
      }
    }, delay);
    this._scheduledId = id;
    return this;
  }

};

ScheduledFunction.wrap = function(fn) {
  var schedule = fn.scheduled_function;
  if (!schedule) {
    schedule = fn.scheduled_function = new ScheduledFunction(fn);
  }
  return schedule;
};

ScheduledFunction.unwrap = function(fn) {
  var schedule = fn.scheduled_function;
  if (schedule) {
    fn.scheduled_function = null;
    schedule.stop();
  }
  return schedule;
};

module.exports = ScheduledFunction;
