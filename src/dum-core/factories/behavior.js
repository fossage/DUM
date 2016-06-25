'use strict';
import {DUM} from '../dum';
export const _behaviors = {};

export const Behavior = (name, func) => {
  _behaviors[name] = func;
}