import {DOM} from '../core/elements';
import {mainNav} from '../components/main-nav';
import {weatherPane} from '../components/weather-pane';
import {test} from '../components/test'
import {Router} from '../router/router';

/*======== COMPONENT SETUP =======*/

/*======== LINKAGE =======*/
Router.config({root: '/', view: mainNav})
.addRoutes([
  {
    name: 'tiles',
    path: '/tiles',
    view: weatherPane
  },
  {
    name: 'reddit',
    path: '/reddit',
    view: test
  }
]);

