'use strict';
import {DUM} from '../dum';
export const _behaviors = {};

export const Behavior = (name, func) => {
  if(_behaviors[name]) throw new Error(`${name} behavior has already been defined`);
  _behaviors[name] = func;
}