'use strict';

import {curry} from '../utils/functional-utils';
import {traverseNodes, callNodesEventCallbacks, createEvent} from '../utils/element-utils'

let TweenMax = require('gsap');

export function registerComponent(elementName, templateId, shadowHost) {
  let CustomElement   = document.registerElement(elementName);
  let link            = document.querySelector(`link[rel="import"]${templateId}-comp`);
  let template        = link.import.querySelector(templateId).innerHTML;
  let component       = decorateEl(new CustomElement());
  component.innerHTML = template;

  if (shadowHost !== null) {
    let host = document.querySelector(shadowHost);
    let root = host.createShadowRoot();
    root.appendChild(component);
  } else {
    document.body.appendChild(component);
  }

  return component;
}

export function createEl(elName) {
  let el          = document.createElement(elName);
  let decoratedEl = decorateEl(el);

  return decoratedEl;
}

export let decorateEl = (function() {
  let uid = 0;

  return (el) => {

    Object.defineProperties(el, {
      $uid: {
        writable: false,
        value: ++uid
      },

      $$mounted: {
        value: false,
        enumerable: false,
        writable: true,
        readable: true,
        configurable: true
      },

      $$eventCallbacks: {
        value: {},
        enumerable: false,
        writable: true,
        readable: true,
        configurable: true
      },

      // @todo: Make this use the touchstart event when using mobile
      touchStart: {
        value: _setUpHandler('click', el)
      },

      touchEnd: {
        value: _setUpHandler('touchend', el)
      },

      click: {
        value: _setUpHandler('click', el)
      },

      to: {
        value: _setUpSingleAnimation(el, 'to')
      },

      from: {
        value: _setUpSingleAnimation(el, 'from')
      },

      fromTo: {
        value: _setUpGroupAnimation(el)
      },

      mouseDown: {
        value: _setUpHandler('mouseDown', el)
      },

      mouseUp: {
        value: _setUpHandler('mouseUp', el)
      },

      // sets up listeners for component specific events such as lifecycle callbacks
      on: {
        value: (eventName, cb) => {
          let cbs;
          if(cb.constructor === Array) {
            cb.forEach((cb) => { cb.bind(el, el); });
            cbs = cb 
          } else if(typeof cb === 'function') {
            cb.bind(el, el);
            cbs = [cb];
          } else {
            throw new TypeError('Argument must be a function or array of functions');
          }

          if(el.$$eventCallbacks[eventName]) {
            el.$$eventCallbacks[eventName] = el.$$eventCallbacks[eventName].concat(cbs);
          } else {
            el.$$eventCallbacks[eventName] = cbs;
          }

          return el;
        }
      },

      // appends components to current component and calls their 'willMount' lifecycle callbacks
      append: {
        value: (...args) => {
          let fragment = document.createDocumentFragment();

          [...args].forEach((childEl) => {
            if(childEl && childEl.constructor === Array){
              childEl.forEach((elem) => {
                if(!elem.$$mounted){
                  traverseNodes(elem, curry(callNodesEventCallbacks, 'willMount'));
                  fragment.appendChild(elem);
                }
              });

              el.appendChild(fragment);
            } else if(childEl){
              if(!childEl.$$mounted) traverseNodes(childEl, curry(callNodesEventCallbacks, 'willMount'));
              el.appendChild(childEl);
            }
          });

          return el;
        }
      },

      // 'updates' a component by creating a new one with the new 
      // options passed in and replacing the old one in the DOM
      update: {
        value: (options) => {
          let comp = el.$constructor(options);
          try{
            el.parentNode.replaceChild(comp, el);
            return el;
          } catch(e){
            console.warn('Cant update element because no parent was found');
            return el;
          }
        }
      },

      remove: {
        value: () => {
          let parent = el.parentNode;
          try {
            traverseNodes(el, curry(callNodesEventCallbacks, 'willUnMount'));
            let removedEl =  parent.removeChild(el);
            traverseNodes(el, curry(callNodesEventCallbacks, 'didUnMount'));
            el.$$mounted = false;

            // Tear down listeners
            Object.keys(eventCallbacks).forEach((key) => {
              eventCallbacks[key].forEach((cb) => {
                el.removeEventListener(key, cb);
              });
            });

            return removedEl;
          } catch(e) {
            console.error(e);
            console.warn('Cant remove element because no parent was found');
            return el;
          }
        }
      },

      setClass: {
        value: (...args) => {
          if(el.classList) el.classList.add(...args);
          return el;
        }
      },

      removeClass: {
        value: (...args) => {
          el.classList.remove(...args);
          return el;
        }
      },

      toggleClass: {
        value: (className) => {
          el.classList.toggle(className);
          return el;
        }
      },

      setId: {
        value: (id) => {
          el.id = id;
          return el;
        }
      },

      // sets styles for the element in a stylesheet rather than on the component itself
      // to allow for overwrites via a css file and/or other components
      setStyles: {
        value: (rules) => {
          let compClass = `component-${el.$uid}`;
          el.setClass(compClass);

          let styleSheet;

          if(document.styleSheets.length){
            styleSheet = document.styleSheets[0];
          } else {
            var styleEl = document.createElement('style');
            document.head.appendChild(styleEl); 
            styleSheet = styleEl.sheet;
          }

          var rule = `.${compClass} {\n`;

          Object.keys(rules).forEach((key) => {
            let cssKey = key.split(/(?=[A-Z])/).join("-");
            rule += `${cssKey}: ${rules[key]};\n`;
          });

          rule += '}';
          styleSheet.insertRule(rule, styleSheet.cssRules.length);

          return el;
        }
      },

      text: {
        value: (txt) => {
          el.innerText = txt;
          return el;
        }
      },

      publish: {
        value: function(eventName, data) {
          let e = createEvent(eventName, data);
          el.dispatchEvent(e);
          
          return el;
        }
      },

      subscribe: {
        value: function(name, cb) {
          window.addEventListener(name, function(e) {
            cb.call(el, e, e.detail.data);
          });
          
          return el;
        }
      },

      setSrc: {
        value: (src) => {
          el.src = src;
          return el;
        }
      },

      // @todo: Do we need this?
      attachFunction: {
        value: (cb) => {
          cb.call(el, el);
          return el;
        }
      },

      // makes the element become a shadow host for native web components
      shadow: {
        value: function(templateId) {
          let link     = document.querySelector('link[rel="import"]' + templateId + '-comp');
          let template = link.import.querySelector(templateId);
          let root     = el.createShadowRoot();
          let clone    = document.importNode(template.content, true);

          root.appendChild(clone);
          return el;
        }
      }
    });

    return el;
  };

  /*===========================================
              PRIVATE FUNCTIONS 
  ===========================================*/
  function _setUpHandler(name, el) {
    return (cb) => {
      if(!cb) return el;
      if (typeof cb !== 'function') throw new TypeError(`Argument to ${name} must be a function`);

      let domName = `on${name.toLowerCase()}`;
      if(!el.$$eventCallbacks[domName]) el.$$eventCallbacks[domName] = [];
      el.$$eventCallbacks[domName] = el.$$eventCallbacks[domName].concat([(cb.bind(el, el))]);

      el[domName] = () => {
        el.$$eventCallbacks[domName].forEach((cb) => {
          cb();
        });
      }

      return el;
    };
  }

  function _setUpSingleAnimation(el, type) {
    let currentAnimation = {duration: null, vars: null};

    return (duration, vars) => {
      if(el.animation && !el.animation._reversed) {
        el.animation.reverse();
        Object.assign(el, 'to', {
          value: TweenMax[type].bind(TweenMax, el, duration, vars),
          writable: false,
          configurable: true
        });

      // Ugly logic block ahead!!!
      } else if(
        (el.animation && el.animation._reversed) 
        || duration !== currentAnimation.duration 
        || !Object.is(vars, currentAnimation.vars)) {

        let timeLine = TweenMax[type](el, duration, vars);
        el.animation = timeLine; 
      }

      return el;
    }
  }

  function _setUpGroupAnimation(el) {
    let currentAnimation = {duration: null, fromVars: null, toVars: null};

    return (duration, fromVars, toVars) => {

      // Ugly logic block ahead!!!
      if(duration !== currentAnimation.duration 
        || !Object.is(fromVars, currentAnimation.fromVars) 
        || !Object.is(toVars, currentAnimation.toVars)) 
      {

        let timeLine = TweenMax.fromTo(el, duration, fromVars, toVars);

        if (!el.animation) el.animation = timeLine;
      }

      return el;
    }
  }
}());
