import {DUM} from '../../dum-core/dum';
import {Component} from '../../dum-core/factories/component';

export let NavButton = Component((opts) => { 
  let styles = Object.assign({margin: '4px'}, opts.styles);
  
  let btn = DUM
    .button
    .text(opts.text)
    .click(opts.click)
    .setStyles(styles);
    
    if(opts.class) btn.setClass(opts.class);
  
  return btn;
});