import {NavButton} from '../component-templates/nav-button';
import {DOM} from '../core/elements';
import {Router} from '../core/router';

export let mainNav = () => {
  
  function navItem(route, text) {
    return DOM
    .li
    .click(() => Router.goTo(route))
    .append(DOM.a.text(text));
  }

  let navBar = DOM.div
  .append(
    DOM.nav
    .append(
      
      DOM
      .div
      .setClass('nav-wrapper', 'cyan', 'darken-1')
      .append(
        DOM.a.setClass('brand-logo', 'left').text('DUM.js'),
        DOM.ul.setClass('right')
        .append(
          navItem('todo', 'Todo List'),
          navItem('reddit', 'Reddit'),
          navItem('/', 'Calendar')
        )
    )));
    
    return navBar;
}