'use strict';

import {DUM} from '../dum-core/dum';
let http = {};

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
  }
  
});



function _request(type) {
  return (endpoint, opts, headerOpts = {}) => {
    
    
    let myHeaders = new Headers(headerOpts);

    let myInit = { 
      method: type,
      headers: myHeaders,
      mode: 'cors',
      cache: 'default' 
    };

    fetch(endpoint, myInit)
    .then((response) => {
      return response;
    });
  }
}

function _assembleUrl(url, params, queryParams) {
  var splitPath = url.split('/');
  var paramKeys = _.keys(params);

  _.each(splitPath, function(pathSection, index) {

    _.each(paramKeys, function(key) {
      if (':' + key === pathSection) {
        splitPath[index] = params[key];
      }
    });
  });

  var path = splitPath.join('/');
  path += queryParams || '';
  
  return path;
}