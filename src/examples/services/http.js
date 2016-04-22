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
      _serverRoot += opts.serverRoot;
    }
  }
  
});

function _request(type) {
  return (endpoint, initOpts = {}, headerOpts = {}) => {
    
    let myHeaders = new Headers(headerOpts);

    let myInit = Object.assign({ 
      method: type,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default' 
    }, initOpts);

    fetch(endpoint, myInit)
    .then((response) => {
      return response;
    });
  }
}