'use strict';
import {DUM} from '../dum';

let _serviceRegistry = {};

// simply provides a singular place where we register our services
// so we can reference them during the config phase
DUM.service = (name, serviceObject) => {
  _serviceRegistry[name] = serviceObject;
  return serviceObject;
}