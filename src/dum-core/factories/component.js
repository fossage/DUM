'use strict';

export let Component = (defaultConstructor) => {
  return (opts) => { 
    if(typeof opts === 'undefined') {
      opts = {};
    } else if(opts.constructor === Array) {
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
