'use strict';

import {decorateEl, createEl} from './dum';
import {curry} from '../utils/functional-utils';
import {traverseNodes, callNodesEventCallbacks} from '../utils/element-utils'

export let DOM = {};
decorateEl(document.body);

Object.defineProperties(DOM, {
  attach: {
    // main method to attatch DOM fragments to the actual DOM
    value: (...args) => {
      let fragment = decorateEl(document.createDocumentFragment());
      
      [...args].forEach((arg) => {
        if(arg && arg.constructor === Array){
          arg.forEach((elem) => { fragment.append(elem); });
        } else {
          fragment.append(arg);
        }
      });
      
      let element = document.body.appendChild(fragment);
      
      // here we call any 'didMount' lifecycle callbacks for each element being attached
      [...args].forEach((arg) => {
        if(arg.constructor === Array){
          arg.forEach((elem) => {
            var current = elem;
            traverseNodes(elem, curry(callNodesEventCallbacks, 'didMount'));
            elem.$$mounted = true;
          });
        } else {
          traverseNodes(arg, curry(callNodesEventCallbacks, 'didMount'));
          arg.$$mounted = true;
        }
      });
      
      return element;
    }
  },
  
  setGlobalStyles: {
    value: (rules) => document.body.setStyles(rules)
  },

  a: {
    get: () => createEl('a')
  },
  
  p: {
    get: () => createEl('p')
  },
  
  h1:  {
    get: () => createEl('h1')
  },
  
  h2:  {
    get: () => createEl('h2')
  },
  
  h3:  {
    get: () => createEl('h3')
  },
  
  h4:  {
    get: () => createEl('h4')
  },
  
  h5:  {
    get: () => createEl('h5')
  },
  
  h6:  {
    get: () => createEl('h6')
  },
  
  ul:  {
    get: () => createEl('ul')
  },
  
  ol: {
    get: () => createEl('ol')
  },
  
  li: {
    get: () => createEl('li')
  },
  
  div: {
    get: () => createEl('div')
  },
  
  img: {
    get: () => createEl('IMG')
  },
  
  small: {
    get: () => createEl('small')
  },
  
  footer: {
    get: () => createEl('footer')
  },
  
  header: {
    get: () => createEl('header')
  },
  
  hgroup: {
    get: () => createEl('hgroup')
  },
  
  nav: {
    get: () => createEl('nav')
  },
  
  dd: {
    get: () => createEl('dd')
  },
  
  dl: {
    get: () => createEl('dl')
  },
  
  dt: {
    get: () => createEl('dt')
  },
  
  figcaption: {
    get: () => createEl('figcaption')
  },
  
  figure: {
    get: () => createEl('figure')
  },
  
  hr: {
    get: () => createEl('hr')
  },
  
  main: {
    get: () => createEl('main')
  },
  
  pre: {
    get: () => createEl('pre')
  },
  
  abbr: {
    get: () => createEl('abbr')
  },
  
  b: {
    get: () => createEl('b')
  },
  
  bdi: {
    get: () => createEl('bdi')
  },
  
  bdo: {
    get: () => createEl('bdo')
  },
  
  br: {
    get: () => createEl('br')
  },
  
  cite: {
    get: () => createEl('cite')
  },
  
  code: {
    get: () => createEl('code')
  },
  
  data: {
    get: () => createEl('data')
  },
  
  dfn: {
    get: () => createEl('dfn')
  },
  
  em: {
    get: () => createEl('em')
  },
  
  i: {
    get: () => createEl('i')
  },
  
  kdb: {
    get: () => createEl('kdb')
  },
  
  mark: {
    get: () => createEl('mark')
  },
  
  q: {
    get: () => createEl('q')
  },
  
  rp: {
    get: () => createEl('rp')
  },
  
  rt: {
    get: () => createEl('rt')
  },
  
  rtc: {
    get: () => createEl('rtc')
  },
  
  ruby: {
    get: () => createEl('ruby')
  },
  
  s: {
    get: () => createEl('s')
  },
  
  samp: {
    get: () => createEl('samp')
  },
  
  span: {
    get: () => createEl('span')
  },
  
  strong: {
    get: () => createEl('strong')
  },
  
  sub: {
    get: () => createEl('sub')
  },
  
  sup: {
    get: () => createEl('sup')
  },
  
  time: {
    get: () => createEl('time')
  },
  
  u: {
    get: () => createEl('u')
  },
  
  wbr: {
    get: () => createEl('wbr')
  },
  
  area: {
    get: () => createEl('area')
  },
  
  audio: {
    get: () => createEl('audio')
  },
  
  map: {
    get: () => createEl('map')
  },
  
  track: {
    get: () => createEl('track')
  },
  
  video: {
    get: () => createEl('video')
  },
  
  embed: {
    get: () => createEl('embed')
  },
  
  object: {
    get: () => createEl('object')
  },
  
  param: {
    get: () => createEl('param')
  },
  
  source: {
    get: () => createEl('source')
  },
  
  canvas: {
    get: () => createEl('canvas')
  },
  
  caption: {
    get: () => createEl('caption')
  },
  
  col: {
    get: () => createEl('col')
  },
  
  colgroup: {
    get: () => createEl('colgroup')
  },
  
  table: {
    get: () => createEl('table')
  },
  
  tbody: {
    get: () => createEl('tbody')
  },
  
  td: {
    get: () => createEl('td')
  },
  
  tfoot: {
    get: () => createEl('tfooter')
  },
  
  th: {
    get: () => createEl('th')
  },
  
  thead: {
    get: () => createEl('thead')
  },
  
  tr: {
    get: () => createEl('tr')
  },
  
  button: {
    get: () => createEl('button')
  },
  
  datalist: {
    get: () => createEl('datalist')
  },
  
  fieldset: {
    get: () => createEl('fieldset')
  },

  form: {
    get: () => createEl('form')
  },

  input: {
    get: () => {
      let input = createEl('input');
      
      input.placeHolder = (val) => {
        input.setAttribute('placeholder', val);
        return input;
      }
      
      input.setType = (val) => {
        input.setAttribute('type', val);
        return input;
      }
      
      input.val = (val) => {
        if(typeof val === 'undefined') return input.value;
        input.value = val;
        return input;
      }
      
      return input;
    }
  },

  keygen: {
    get: () => createEl('keygen')
  },

  label: {
    get: () => createEl('label')
  },

  legend: {
    get: () => createEl('legend')
  },
  
  meter: {
    get: () => createEl('meter')
  },

  optgroup: {
    get: () => createEl('optgroup')
  },

  option: {
    get: () => createEl('option')
  },
  
  progress: {
    get: () => createEl('progress')
  },

  select: {
    get: () => createEl('select')
  },
  
  details: {
    get: () => createEl('details')
  },

  dialog: {
    get: () => createEl('dialog')
  },

  menu: {
    get: () => createEl('menu')
  },
  
  menuitem: {
    get: () => createEl('menuitem')
  },

  summary: {
    get: () => createEl('summary')
  },
  
  //componenets
  content: {
    get: () => createEl('content')
  },

  element: {
    get: () => createEl('element')
  },

  shadow: {
    get: () => createEl('shadow')
  },

  template: {
    get: () => createEl('template')
  }
});


