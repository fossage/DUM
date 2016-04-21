'use strict';

export function pxParser(rule) {
  return parseInt(rule.slice(0, -2), 10);
}

// slightly modified version of code
// @http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
export let getParamNames = (function(){
  let STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
  let ARGUMENT_NAMES = /([^\s,]+)/g;
  
  return (func) => {
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    
    if(result === null) result = [];
    
    return result;
  }
}());