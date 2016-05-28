import {HTTP} from './http';
import {DUM} from '../../dum-core/dum';

let reddit = {};
export let Reddit = DUM.service('reddit', reddit);

Object.defineProperties(reddit, {
  _credentials: {
    value: null,
    readable: true,
    configurable: true,
    writable: true
  },

  authorize: {
    value: ()=> {
      return HTTP.get('authorize_reddit')
      .then((res) => {
        reddit._credentials = res;
        return res;
      });
    }
  },
  
  get: {
    value: (subReddit = 'webdev', type = 'hot') => {
      let myHeaders = {'token': reddit._credentials.access_token};
      let endpoint = `https://oauth.reddit.com/r/${subReddit}/${type}`;
      
      if(!reddit._credentials) {
        throw new Error('Reddit service must get authorization creditials via Reddit.authorize() before making requests.');
      }
      
      return HTTP.get(`reddit/${subReddit}/${type}`, {}, myHeaders);
    }
  }
});
