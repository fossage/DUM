import {DOM} from '../core/elements';
import {mainNav} from '../components/main-nav';
import {todoList} from '../components/todo-list';
import {test} from '../components/test'
import {Router} from '../core/router';

/*======== COMPONENT SETUP =======*/

/*======== LINKAGE =======*/
Router.config({root: '/', view: mainNav})
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

