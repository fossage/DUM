'use strict';
import {DUM} from '../dum-core/dum';
import {todoList} from './components/todo-list-component';
import {reddit} from './components/reddit-component';


function tdl() {
  return todoList({items: ['stuff', 'things', 'other stuff']})
}

/*======== ROUTES =======*/
DUM.Router
.addRoutes([
  {
    name: 'todo',
    path: '/todo',
    view: tdl
  },
  {
    name: 'reddit',
    path: '/reddit',
    view: reddit
  }
]);