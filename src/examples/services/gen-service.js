'use strict';
import {DUM} from '../../dum-core/dum';

export const Gen = DUM.Service('Gen', {});

Object.defineProperties(Gen, {
  co: {
    value: (input) => {
      let generator;
      if(_isGenerator(input))         generator = input;
      if(_isGeneratorFunction(input)) generator = input();
      if(!generator) throw `Invalid parameter to co ${input}`;

      return new Promise((resolve, reject) => {
        next();

        function next(val, isError) {
          let res;
          
          try {
            res = isError ? generator.throw(val) : generator.next(val);
          } catch(e) {
            reject(e);
          }

          if(res.done) return resolve(res.value);
          toPromise(res.value).then(next, (error) => next(error, true));
        }

        function toPromise(val) {
          if(_isGenerator(val) || _isGeneratorFunction(val)) return Gen.co(val);
          if(val.then) return val;

          if(typeof val === 'function') {
            return new Promise((resolve, reject) => {
              val((error, res) => error ? reject(error) : resolve(res));
            });
          }

          if(Array.isArray(val)) return Promise.all(val.map(toPromise));
          return Promise.reject(new Error(`Invalid yield ${val}`));
        }
      }); 
    }
  },

  Listener: {
    value: function* (cb) {
      while(true) {
        yield cb;
      }
    }
  },

  Notifier: {
    value: (fn) => {
      return { notify: fn }
    } 
  },

  bindData: {
    value: (listener, notifier) => {
      let genListener = Gen.Listener(listener);
      
      let originalFunc = notifier.notify;

      notifier.notify = new Proxy(originalFunc, {
        apply: (target, thisArg, argumentsList) => {
          let updatedData = target.apply(thisArg, argumentsList);
          let a = genListener.next().value(updatedData);
          return updatedData
        }
      });
      
    }
  }
});

function _isGenerator(val) {
  return typeof val.next === 'function';
}

function _isGeneratorFunction(val) {
  return val.constructor && val.constructor.name === 'GeneratorFunction';
}

