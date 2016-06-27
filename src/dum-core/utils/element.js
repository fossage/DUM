'use strict';

export function traverseNodes(node, cb) {
  if(cb) cb(node);

  if(node.childNodes.length) {
    Object.keys(node.childNodes).forEach((key) => traverseNodes(node.childNodes[key], cb));
  }
}

export function callNodesEventCallbacks(node, event) {
  if(node.$$eventCallbacks && node.$$eventCallbacks[event]) {
    node.$$eventCallbacks[event].forEach((cb) => cb());
  }
}

export function createEvent(eventName, data, options = {}) {
  return  new CustomEvent(eventName, {
    detail: { data: data }, 
    bubbles: options.bubbles || true, 
    cancelable: options.cancelable || false
  });
}

export const decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();