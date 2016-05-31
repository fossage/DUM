'use strict';

import {DUM} from '../../dum-core/dum';
let http = {};
let _serverRoot = 'http://';

export let HTTP = DUM.service('HTTP', http);

Object.defineProperties(http, {
  get: {
    value: _request('GET')
  },
  
  put: {
    value: null
  },
  
  post: {
    value: null
  },

  delete: {
    value: null
  },
  
  config: {
    value: (opts) => {
      _serverRoot += opts.serverRoot + '/';
    }
  }
  
});

function _request(type) {
  return (endpoint, initOpts = {}, headerOpts = {}) => {
    let defaultHeaders = {'content-type': 'application/json'};
    let myHeaders = new Headers(Object.assign(defaultHeaders, headerOpts));
    
    let initializer = Object.assign({ 
      method: type,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default' 
    }, initOpts);
    
    let path = _serverRoot + (endpoint || '');

    return fetch(`http://localhost:3000/api/${endpoint}`, initializer)
    .then((response) => {
      return response[initOpts.contentType || 'json']();
    });
  }
}