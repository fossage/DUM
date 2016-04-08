import {NavButton} from '../component-templates/nav-button';
import {DOM} from '../core/elements'

export let mainNav = setUpNav();

function setUpNav(){
  let navOptions = [
    { text: 'Todo List' },
    { text: 'Calendar' },
    { text: 'Reddit Clone' }
  ];
  
  let navButtons = NavButton(navOptions);
  
  let navBar = DOM
    .div
    .setStyles({ 
      width: '100%', 
      padding: '5px',
      margin: '10px 5px 0 5px',
      borderBottom: '2px solid #aaa',
      position: 'fixed',
      top: '0'
    })
    .append(navButtons);
    
    return navBar;
}