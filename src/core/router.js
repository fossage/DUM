'use strict';
import {createEvent} from '../utils/element-utils';
import {DOM} from '../core/elements';

export let Router = {};

let _routes = {};
let _currentState = null;
let _prevState = null;
let _rootView = null;

window.addEventListener('popstate', (e) => {
  let state = e.state || _routes.root;
  _prevState = _currentState;
  _routes[_prevState.name].$$instanceView.remove();
  let iView = _routes[state.name].view();
  _rootView.append(iView);
  _currentState = _routes[state.name] || Router._config.root;
  _currentState.$$instanceView = iView;
});

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
      let view = opts.view();
      _rootView = view;
      _routes.root = { name: 'root', path: Router.root };
      _currentState = _routes.current = _routes.root;
      DOM.attach(view);
      
      return Router;
    },
  },
  
  addRoutes: {
    value: (routeInfo) => {
      routeInfo.forEach((route) => {
        if(!route.name || !route.path) throw new Error('Route objects require a name and a path key to be set.');
        _routes[route.name] = route;
      });

      return Router;
    }
  },
  
  goTo: {
    value: (routeName) => {
      let state = _routes[routeName];
      if(state.path === _currentState.path) return Router;
      state.$$instanceView = state.view();
      
      state.$$instanceView = state.view();
      
      let stateStart = createEvent('stateChangeStart', _routes.current);
      window.dispatchEvent(stateStart);
      
      let parent = state.$$instanceView.parentNode || _rootView;
      let appendMethod = state.$$instanceView.parentNode ? 'append' : 'appendChild';

      if(_currentState.$$instanceView && _currentState.$$instanceView.remove) _currentState.$$instanceView.remove();
      if(state.$$instanceView) parent[appendMethod](state.$$instanceView);

      history.pushState({name: state.name, path: state.path}, state.name || '', state.path);
      _currentState = state;

      let stateEnd = createEvent('stateChangeEnd', state);
      window.dispatchEvent(stateEnd);
      
      return Router;
    }
  }
});