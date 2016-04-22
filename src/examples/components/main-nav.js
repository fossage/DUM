import {DUM} from '../../dum-core/dum';
import {HTTP} from '../services/http';
import {NavButton} from '../component-templates/nav-button';

export let mainNav = () => {

  let navBar = DUM.div
  .append(
    
    DUM
    .nav
    .append(
      
      DUM
      .div
      .setClass('nav-wrapper', 'cyan', 'darken-1')
      .append(
        
        DUM
        .a
        .setClass('brand-logo', 'left')
        .text('DUM.js'),
        
        DUM
        .ul
        .setClass('right')
        .append(
          navItem('todo', 'Todo List'),
          navItem('reddit', 'Reddit'),
          navItem('/', 'Calendar')
        )
    )));
    
  function navItem(route, text) {
    return DUM
      .li
      .click(() => DUM.Router.goTo(route))
      .append(
        
        DUM
        .a
        .text(text)
      );
  }
    
    return navBar;
}