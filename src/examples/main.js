import {mainNav} from './components/main-nav';
import {todoList} from './components/todo-list';
import {test} from './components/test';
import {DUM} from '../dum-core/dum';

require('./styles/main.scss');
/*======== COMPONENT SETUP =======*/

/*======== LINKAGE =======*/
DUM.Router
.config({
  root: { 
    name: 'root',
    path: '/', 
    view: mainNav
  }
})
.addRoutes([
  {
    name: 'todo',
    path: '/todo',
    view: todoList
  },
  {
    name: 'reddit',
    path: '/reddit',
    view: test
  }
]);
