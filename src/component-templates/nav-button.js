import {DOM} from '../core/elements';
import {Component} from '../core/component-factory';
import {Router} from '../core/router'

export let NavButton = Component((opts) => { 
  let styles = Object.assign({margin: '4px'}, opts.styles);
  
  let btn = DOM
    .button
    .text(opts.text)
    .click(opts.click)
    .setStyles(styles);
    
    if(opts.class) btn.setClass(opts.class);
  
  return btn;
});