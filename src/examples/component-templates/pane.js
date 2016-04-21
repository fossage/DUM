'use strict'

import {DUM} from '../../dum-core/dum';
import {pxParser} from '../../dum-core/utils/string';
import {Component} from '../../dum-core/factories/component';

let TweenMax = require('gsap');

export let Pane = Component((opts) => {
  
  let styles = Object.assign({ 
    color: '#fff',
    textShadow: '2px 1px 2px rgba(150, 150, 150, 1)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '205px',
    width: '800px',
    left: '0',
    zIndex: '10',
    margin: '0',
    position: 'absolute',
    top: '200px'
  }, opts);
  
  let wrapper = DUM
    .div
    .setStyles(styles)
    .touchStart((el) => {
      wrapper.to(0.2, styles);
      el.publish('closePane', {});
    });
    
  let heading = DUM.h1;
  
  wrapper.append(heading);
  
  return wrapper;
  
});
