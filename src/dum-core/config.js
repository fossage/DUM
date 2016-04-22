import {DUM} from './dum';
import {_serviceRegistry} from './factories/service';

DUM.config = (configOpts) => {
  if(configOpts.constructor !== Array) {
    let message = 'Argument to config must be an array of configuration objects if the form of [{name: \'FooService\', opts: {}}]'
    throw new TypeError(message);
  }
  
  configOpts.forEach((opt) => {
    let config = _serviceRegistry[opt.name].config;
    if(!config) throw new Error('Services must have a config method set to be used in the config phase');
    config(opt.options);
  });
  
  return DUM;
}
