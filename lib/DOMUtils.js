'use strict';

var $ = require('jquery');

module.exports = {
  // Is an element inside a parent, or the actual parent?
  isElementOrInside: function(node, parentNode) {
    // TOOD: Avoid using jQuery
    return node && parentNode &&
      (node === parentNode || $.contains(parentNode, node));
  },

  getWindowScrollTop: function() {
    return window.pageYOffset || window.scrollY || window.scrollTop || 0;
  },

  setWindowScrollTop: function(y) {
    window.scrollTo(0, y);
  },

  getWindowWidth: function() {
    // TOOD: Avoid using jQuery
    return $(window).outerWidth();
  },

  getWindowHeight: function() {
    // TOOD: Avoid using jQuery
    return $(window).outerHeight();
  },

  getWidth: function(element) {
    // TOOD: Avoid using jQuery
    return $(element).outerWidth();
  },

  getHeight: function(element) {
    // TOOD: Avoid using jQuery
    return $(element).outerHeight();
  },

  getOffsetTop: function(element) {
    // TOOD: Avoid using jQuery
    return $(element).offset().top;
  },

  getOffsetLeft: function(element) {
    return $(element).offset().left;
  }

};
