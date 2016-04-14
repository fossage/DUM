import {NavButton} from '../component-templates/nav-button';
import {DOM} from '../core/elements';
import {Router} from '../router/router';

export let mainNav = setUpNav();

function setUpNav(){
  let navOptions = [
    { text: 'Todo List', click: () => { Router.goTo('tiles'); }},
    { text: 'Reddit' , click: () => { Router.goTo('reddit'); }},
    { text: 'Calendar' }
  ];
  
  let navButtons = NavButton(navOptions);

  let navBar = DOM
    .div
    .setStyles({paddingTop: '70px'})
    .append(
      
      DOM
      .div
      .setStyles({ 
        width: '100%', 
        padding: '5px',
        margin: '10px 5px 0 5px',
        borderBottom: '2px solid #aaa',
        position: 'fixed',
        top: '0'
      })
      .append(navButtons));
    
    return navBar;
}