'use strict';

import $ from 'jquery';

// Is an element inside a parent, or the actual parent?
export function isElementOrInside(node, parentNode) {
  // TOOD: Avoid using jQuery
  return node && parentNode &&
    (node === parentNode || $.contains(parentNode, node));
}

export function getWindowScrollTop() {
  return window.pageYOffset || window.scrollY || window.scrollTop || 0;
}

export function setWindowScrollTop(y) {
  window.scrollTo(0, y);
}

export function getWindowWidth() {
  // TOOD: Avoid using jQuery
  return $(window).outerWidth();
}

export function getWindowHeight() {
  // TOOD: Avoid using jQuery
  return $(window).outerHeight();
}

export function getWidth(element) {
  // TOOD: Avoid using jQuery
  return $(element).outerWidth();
}

export function getHeight(element) {
  // TOOD: Avoid using jQuery
  return $(element).outerHeight();
}

export function getOffsetTop(element) {
  // TOOD: Avoid using jQuery
  return $(element).offset().top;
}

export function getOffsetLeft(element) {
  return $(element).offset().left;
}

export function isPointInsideElement(element, point) {
  const $el = $(element);
  const left = $el.offset().left;
  const top = $el.offset().top;
  const width = $el.outerWidth();
  const height = $el.outerHeight();
  return point[0] >= left && point[0] < left + width &&
    point[1] >= top && point[1] < top + height;
}

// Backwards compatibility, remove when Homeland is updated
export default {
  isElementOrInside: isElementOrInside,
  getWindowScrollTop: getWindowScrollTop,
  setWindowScrollTop: setWindowScrollTop,
  getWindowWidth: getWindowWidth,
  getWindowHeight: getWindowHeight,
  getWidth: getWidth,
  getHeight: getHeight,
  getOffsetTop: getOffsetTop,
  getOffsetLeft: getOffsetLeft,
  isPointInsideElement: isPointInsideElement
};
