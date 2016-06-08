import {DUM} from '../../dum-core/dum';

export let NavButton = DUM.Component((opts) => { 
  let styles = Object.assign({margin: '4px'}, opts.styles);
  
  let btn = DUM
    .button
    .text(opts.text)
    .click(opts.click)
    .setStyles(styles);
    
    if(opts.class) btn.setClass(opts.class);
  
  return btn;
});