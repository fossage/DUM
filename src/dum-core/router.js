'use strict';
import {createEvent} from './utils/element';
import {DUM} from './dum';

DUM.Router = DUM.Service('Router', {});

let _routes       = {};
let _rootView     = null;
let _prevState    = null;
let _initialized  = false;
let _currentState = null;

/*===============================================
            LISTENER INITIALIZATION
============================================== */
window.addEventListener('popstate', (e) => {
  let state = e.state || DUM.Router.$$config.root;
  _prevState = _currentState;
  
  // ensure we don't remove our root view
  if(_prevState.name !== 'root') _routes[_prevState.name].$$instanceView.remove();
  
  // if not root route, append the view associated with the route to root view
  if(state.name !== 'root') {
    let iView = _routes[state.name].view();
    _currentState = _routes[state.name]
    _currentState.$$instanceView = iView;
    _rootView.append(iView);
  } else {
     _currentState = DUM.Router.$$config.root;
  }
});

/*===============================================
             METHOD/PROP DEFINITIONS
============================================== */
Object.defineProperties(DUM.Router, {
  $$config: {
    value: {
      root: {
        name: 'root',
        path: '/',
        view: null
      }
    }
  },

  config: {
    value: (opts) => {
      if(!opts.root && opts.root.view) throw new Error('Router requires a root configuration object with a root view');
      Object.assign(DUM.Router.$$config, opts);
      _rootView = opts.root.view();
      _currentState = _routes.root = DUM.Router.$$config.root;
      DUM.attach(_rootView);

      return DUM.Router;
    },
  },
  
  addRoutes: {
    value: (routeInfo) => {
      routeInfo.forEach((route) => {
        if(!route.name || !route.path) throw new Error('Route objects require a name and a path key to be set.');
        _routes[route.name] = route;
      });
      
      // if we are on inital app load, automatically go to the pathname in url
      if(!_initialized) {
        let path = window.location.pathname;
        
        if(path !== '/') { 
          DUM.Router.goTo(path.slice(1));
        } else {
          let root = DUM.Router.$$config.root;
          DUM.Router.goTo(root.redirectTo || root.path);
        }
      } 
      _initialized = true;

      return DUM.Router;
    }
  },
  
  goTo: {
    value: (routeName) => {
      let state = _routes[routeName];
      if(state.path === _currentState.path) return DUM.Router;
      state.$$instanceView = state.view();

      let stateStart = createEvent('stateChangeStart', _currentState);
      window.dispatchEvent(stateStart);
      
      let parent = state.$$instanceView.parentNode || _rootView;
      let appendMethod = state.$$instanceView.parentNode ? 'append' : 'appendChild';

      if(_currentState.$$instanceView && _currentState.$$instanceView.remove) _currentState.$$instanceView.remove();
      if(state.$$instanceView) parent[appendMethod](state.$$instanceView);

      history.pushState({name: state.name, path: state.path}, state.name || '', state.path);
      _currentState = state;

      let stateEnd = createEvent('stateChangeEnd', state);
      window.dispatchEvent(stateEnd);
      
      return DUM.Router;
    }
  }
});