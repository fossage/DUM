import {DOM} from '../core/elements';
import {mainNav} from '../components/main-nav';
import {todoList} from '../components/todo-list';
import {test} from '../components/test'
import {Router} from '../router/router';

/*======== COMPONENT SETUP =======*/

/*======== LINKAGE =======*/
Router.config({root: '/', view: mainNav})
.addRoutes([
  {
    name: 'tiles',
    path: '/tiles',
    view: todoList
  },
  {
    name: 'reddit',
    path: '/reddit',
    view: test
  }
]);

