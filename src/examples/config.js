import {mainNav} from './components/main-nav-component';
import {DUM} from '../dum-core/dum';

require('./styles/main.scss');
/*======== COMPONENT SETUP =======*/
let nav = () => {
  return mainNav({
    wrapperClasses: 'darken-1',
    items: [
      {
        type: 'a',
        classes: 'brand-logo',
        align: 'left',
        text: 'DUM.js'
      },
      {
        text: 'TODO',
        goTo: 'todo'
      },
      {
        text: 'Reddit',
        goTo: 'reddit'
      }
    ]
  })
}

/*======== CONFIG =======*/
DUM.config([
  {
    name: 'HTTP',
    options: { serverRoot: 'localhost:3000/api'}
  },
  
  {
    name: 'Router',
    options: {
      root: { 
        name: 'root',
        path: '/', 
        view: nav,
        redirectTo: 'todo'
      }
    }
  }
]);

