'use strict';
import {DUM} from '../dum';

/* 
  Exports a high level component constructor function which takes
  in a user defined constructor for a component but takes the additional
  steps to attach a reference to the original user defined constructor which
  will be used when a component is updated to, rather than update specific props
  on the node, replaces it entirely(not sure if this is a good idea, might trigger
  reflow, however if we get some virtual DOM diffing in place, might come in handy
  for when we actually do need to create all new components)
*/

export let Component = (defaultConstructor) => {
  return (opts = {}) => { 
    // If the user defined opts and its an array, set it up here and 
    // take the early out at the return statement, otherwise go below 'if' block
    if(opts.constructor === Array) {
      let fragment          = document.createDocumentFragment();
      fragment.$constructor = Component(defaultConstructor);
    
      opts.forEach((opt) => {
        let comp = defaultConstructor(opt);
        fragment.appendChild(comp);
      });
      
      return fragment; 
    }
 
    let comp          = defaultConstructor(opts);
    comp.$constructor = Component(defaultConstructor);
    
    return comp;
    
  }
}


