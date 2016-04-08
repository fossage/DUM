'use strict';
import {createEvent} from '../utils/element-utils';
import {DOM} from '../core/elements';

export let Router = {};

let _routes = {};
let _currentView = null;

Object.defineProperties(Router, {
  _config: {
    value: {
      root: '/',
      view: null
    }
  },

  config: {
    value: (opts) => {
      if(!opts.view) throw new Error('Router requires a default view');

      Object.assign(Router._config, opts);
      _routes.root = { name: 'root', path: Router.root };
      _routes.current = _routes.root;
      DOM.attach(opts.view);
      
      return Router;
    },
  },
  
  addRoutes: {
    value: (routeInfo) => {
      routeInfo.forEach((route) => {
        if(!route.name || !route.path) {
          throw new Error('Route objects require a name and a path key to be set.');
        }
        
        _routes[route.name] = route;
      });

      return Router;
    }
  },
  
  goTo: {
    value: (routeName) => {
      let stateStart = createEvent('stateChangeStart', _routes.current);

      window.dispatchEvent(stateStart);
      let state = _routes[routeName];
      let parent = state.parent || document.body;
      let appendMethod = state.parent ? 'append' : 'appendChild';

      // if(_currentView) _currentView.remove();
      if(state.view) _currentView = parent[appendMethod](state.view);

      history.pushState(state.data || {}, state.name || 'name', state.path);

      let stateEnd = createEvent('stateChangeEnd', state);

      window.dispatchEvent(stateEnd);
      
      return Router;
    }
  }
});