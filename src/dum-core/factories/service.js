'use strict';
export let _serviceRegistry = {};

// simply provides a singular place where we register our services
// so we can reference them during the config phase
export let Service = (name, serviceObject) => {
  if(!serviceObject) return _serviceRegistry[name];
  
  _serviceRegistry[name] = serviceObject;
  return serviceObject;
}