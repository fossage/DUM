import {DOM} from '../core/elements';
import {Component} from '../core/component-factory';
import {Router} from '../core/router'

export let NavButton = Component((opts) => {
 
  let styles = Object.assign(opts, {
    padding: '5px',
    margin: '0 5px',
    fontSize: '1em',
    borderRadius: '3px'
  });
  
  return DOM
    .button
    .text(opts.text)
    .click(opts.click)
    .setStyles(styles);
});