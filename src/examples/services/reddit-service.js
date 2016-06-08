import {HTTP} from './http-service';
import {DUM} from '../../dum-core/dum';
import {StateManager} from './state-manager-service'

export let Reddit = DUM.Service('Reddit', {});

Object.defineProperties(Reddit, {
  _credentials: {
    value: null,
    configurable: true,
    writable: true
  },
  
  authorize: {
    value: ()=> {
      if(!Reddit._credentials) {
        return HTTP.get('authorize_reddit')
        .then((res) => {
          Reddit._credentials = res;
          return res;
        });
      } else {
        return Promise.resolve(Reddit._credentials);
      }
    }
  },
  
  get: {
    value: (opts = {}) => {
      let headers = {'token': Reddit._credentials.access_token};
      
      if(!Reddit._credentials) {
        throw new Error('Reddit service must get authorization creditials via Reddit.authorize() before making requests.');
      }
      
      return StateManager.get({
        name: 'subreddit',
        headers: headers,
        urlParams: {
          subReddit: opts.subReddit || 'funny', 
          type: opts.type || 'hot'
        }
      }, opts)
    }
  }
});
