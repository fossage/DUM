'use strict';

import {DUM} from './dum';
import {curry} from './utils/functional';
import {traverseNodes, callNodesEventCallbacks} from './utils/element'

DUM.decorateEl(document.body);

Object.defineProperties(DUM, {
  attach: {
    // main method to attatch DOM fragments to the actual DOM
    value: (...args) => {
      let fragment = DUM.decorateEl(document.createDocumentFragment());
      
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
        if(arg){
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
        }
      });
      
      return element;
    }
  },
  
  setGlobalStyles: {
    value: (rules) => document.body.setStyles(rules)
  },

  a: {
    get: () => {
      let a = DUM.createEl('a');
      
      a.setHref = (link) => {
        a.setAttribute('href', link);
        return a;
      }
      
      return a;
    }
  },
  
  p: {
    get: () => DUM.createEl('p')
  },
  
  h1:  {
    get: () => DUM.createEl('h1')
  },
  
  h2:  {
    get: () => DUM.createEl('h2')
  },
  
  h3:  {
    get: () => DUM.createEl('h3')
  },
  
  h4:  {
    get: () => DUM.createEl('h4')
  },
  
  h5:  {
    get: () => DUM.createEl('h5')
  },
  
  h6:  {
    get: () => DUM.createEl('h6')
  },
  
  ul:  {
    get: () => DUM.createEl('ul')
  },
  
  ol: {
    get: () => DUM.createEl('ol')
  },
  
  li: {
    get: () => DUM.createEl('li')
  },
  
  div: {
    get: () => DUM.createEl('div')
  },
  
  img: {
    get: () => DUM.createEl('IMG')
  },
  
  small: {
    get: () => DUM.createEl('small')
  },
  
  footer: {
    get: () => DUM.createEl('footer')
  },
  
  header: {
    get: () => DUM.createEl('header')
  },
  
  hgroup: {
    get: () => DUM.createEl('hgroup')
  },
  
  nav: {
    get: () => DUM.createEl('nav')
  },
  
  dd: {
    get: () => DUM.createEl('dd')
  },
  
  dl: {
    get: () => DUM.createEl('dl')
  },
  
  dt: {
    get: () => DUM.createEl('dt')
  },
  
  figcaption: {
    get: () => DUM.createEl('figcaption')
  },
  
  figure: {
    get: () => DUM.createEl('figure')
  },
  
  hr: {
    get: () => DUM.createEl('hr')
  },
  
  main: {
    get: () => DUM.createEl('main')
  },
  
  pre: {
    get: () => DUM.createEl('pre')
  },
  
  abbr: {
    get: () => DUM.createEl('abbr')
  },
  
  b: {
    get: () => DUM.createEl('b')
  },
  
  bdi: {
    get: () => DUM.createEl('bdi')
  },
  
  bdo: {
    get: () => DUM.createEl('bdo')
  },
  
  br: {
    get: () => DUM.createEl('br')
  },
  
  cite: {
    get: () => DUM.createEl('cite')
  },
  
  code: {
    get: () => DUM.createEl('code')
  },
  
  data: {
    get: () => DUM.createEl('data')
  },
  
  dfn: {
    get: () => DUM.createEl('dfn')
  },
  
  em: {
    get: () => DUM.createEl('em')
  },
  
  i: {
    get: () => DUM.createEl('i')
  },
  
  kdb: {
    get: () => DUM.createEl('kdb')
  },
  
  mark: {
    get: () => DUM.createEl('mark')
  },
  
  q: {
    get: () => DUM.createEl('q')
  },
  
  rp: {
    get: () => DUM.createEl('rp')
  },
  
  rt: {
    get: () => DUM.createEl('rt')
  },
  
  rtc: {
    get: () => DUM.createEl('rtc')
  },
  
  ruby: {
    get: () => DUM.createEl('ruby')
  },
  
  s: {
    get: () => DUM.createEl('s')
  },
  
  samp: {
    get: () => DUM.createEl('samp')
  },
  
  span: {
    get: () => DUM.createEl('span')
  },
  
  strong: {
    get: () => DUM.createEl('strong')
  },
  
  sub: {
    get: () => DUM.createEl('sub')
  },
  
  sup: {
    get: () => DUM.createEl('sup')
  },
  
  time: {
    get: () => DUM.createEl('time')
  },
  
  u: {
    get: () => DUM.createEl('u')
  },
  
  wbr: {
    get: () => DUM.createEl('wbr')
  },
  
  area: {
    get: () => DUM.createEl('area')
  },
  
  audio: {
    get: () => DUM.createEl('audio')
  },
  
  map: {
    get: () => DUM.createEl('map')
  },
  
  track: {
    get: () => DUM.createEl('track')
  },
  
  video: {
    get: () => DUM.createEl('video')
  },
  
  embed: {
    get: () => DUM.createEl('embed')
  },
  
  object: {
    get: () => DUM.createEl('object')
  },
  
  param: {
    get: () => DUM.createEl('param')
  },
  
  source: {
    get: () => DUM.createEl('source')
  },
  
  canvas: {
    get: () => DUM.createEl('canvas')
  },
  
  caption: {
    get: () => DUM.createEl('caption')
  },
  
  col: {
    get: () => DUM.createEl('col')
  },
  
  colgroup: {
    get: () => DUM.createEl('colgroup')
  },
  
  table: {
    get: () => DUM.createEl('table')
  },
  
  tbody: {
    get: () => DUM.createEl('tbody')
  },
  
  td: {
    get: () => DUM.createEl('td')
  },
  
  tfoot: {
    get: () => DUM.createEl('tfooter')
  },
  
  th: {
    get: () => DUM.createEl('th')
  },
  
  thead: {
    get: () => DUM.createEl('thead')
  },
  
  tr: {
    get: () => DUM.createEl('tr')
  },
  
  button: {
    get: () => DUM.createEl('button')
  },
  
  datalist: {
    get: () => DUM.createEl('datalist')
  },
  
  fieldset: {
    get: () => DUM.createEl('fieldset')
  },

  form: {
    get: () => DUM.createEl('form')
  },

  input: {
    get: () => {
      let input = DUM.createEl('input');
      
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
    get: () => DUM.createEl('keygen')
  },

  label: {
    get: () => DUM.createEl('label')
  },

  legend: {
    get: () => DUM.createEl('legend')
  },
  
  meter: {
    get: () => DUM.createEl('meter')
  },

  optgroup: {
    get: () => DUM.createEl('optgroup')
  },

  option: {
    get: () => DUM.createEl('option')
  },
  
  progress: {
    get: () => DUM.createEl('progress')
  },

  select: {
    get: () => DUM.createEl('select')
  },
  
  details: {
    get: () => DUM.createEl('details')
  },

  dialog: {
    get: () => DUM.createEl('dialog')
  },

  menu: {
    get: () => DUM.createEl('menu')
  },
  
  menuitem: {
    get: () => DUM.createEl('menuitem')
  },

  summary: {
    get: () => DUM.createEl('summary')
  },
  
  //componenets
  content: {
    get: () => DUM.createEl('content')
  },

  element: {
    get: () => DUM.createEl('element')
  },

  shadow: {
    get: () => DUM.createEl('shadow')
  },

  template: {
    get: () => DUM.createEl('template')
  }
});


