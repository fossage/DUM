'use strict';

export let tryProp = (obj, propChain) => {
  let props = propChain.split('.');
  let current = obj;

  for(let i = 0; i < props.length; i++) {
    try {
      current = current[props[i]];
    } catch(e) {
      return false;
    }
  }

  return current;
}
