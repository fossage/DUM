'use strict';

export function curry(cb, ...args) {
  return (...args2) => cb(...args2, ...args)}