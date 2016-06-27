import {HTTP} from './http-service';
import {decodeEntities} from '../../dum-core/utils/element';
import {DUM} from '../../dum-core/dum';
import {StateManager} from './state-manager-service';

const REDDITUSERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2728.0 Safari/537.36:dum.demo:v0.0.1 (by /u/fossage)';

export const Reddit = DUM.Service('Reddit', {});

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
        queryParams: opts.queryParams || null,
        urlParams: {
          subReddit: opts.subReddit || 'funny', 
          type: opts.type || 'hot'
        },
      }, opts)
    }
  },

  getImage: {
    value: ((url) => {
      let initializer = {
        method: 'get',
        contentType: 'image/jpeg',
        headers: {'user-agent': REDDITUSERAGENT},
        auth: {bearer: Reddit._credentials.access_token}
      };

      

      let raw = decodeEntities(url);

      return fetch(raw, initializer)
      .then((response) => {
        let method;
        let type = response.headers.get('content-type');
        if(type === 'text/html; charset=utf-8') {
          method = 'text';
        } else {
          method = 'blob';
        }

        return response[method]()
        .then((data) => {
          DUM.publish('loaderStop');
          if(typeof data === 'string') return {type: 'string', data: data}
          return {type: 'image', data: URL.createObjectURL(data)};
        });
      });
    })
  }
});

