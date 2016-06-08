'use strict';

export let ResourceMap = {};

Object.defineProperties(ResourceMap, {
  subreddit: {
    value: {
      path: 'reddit/:subReddit/:type'
    }
  }
});