'use strict';
import {DUM} from '../dum-core/dum';
import {todoList} from './components/todo-list-component';
import {reddit} from './components/reddit-component';

/*======== ROUTES =======*/
DUM.Router
.addRoutes([
  {
    name: 'todo',
    path: '/todo',
    view: todoList
  },
  {
    name: 'reddit',
    path: '/reddit',
    view: reddit
  }
]);