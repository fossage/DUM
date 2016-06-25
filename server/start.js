'use strict';

let   KOA              = require('koa'),
      request          = require('request'),
      Deepstream       = require('deepstream.io'),
      Router           = require('koa-router'),
      BodyParser       = require('koa-bodyparser'),
      Send             = require('koa-send'),
      Static           = require('koa-static'),
      staticDir        = Static('../dst'),
      ds               = new Deepstream(),
      router           = new Router(),
      app              = module.exports = KOA();


const REDDITUSERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2728.0 Safari/537.36:dum.demo:v0.0.1 (by /u/fossage)';

app.use(BodyParser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path);
  }
}));

// ds.set( 'urlPath', '/io' );
// ds.set( 'httpServer', app );

router
.get('/api/authorize_reddit', function *(next) {
  this.body = request({
    url: 'https://www.reddit.com/api/v1/access_token',
    method: 'post',
    body: 'grant_type=client_credentials',
    contentType: 'application/json',
    userAgent: REDDITUSERAGENT, 
    auth: {
      user: 'Qgi8jZLJNYYA1w',
      pass: 'K5w3C77ZaglMqdRPDaBe9nvhjSU'
    }
  }, (err, resp, body) => {
    return body;
  })
})

.get('/api/reddit_image', function* (next){
  let url = decodeURI(this.headers['reddit-url']);
  let token = this.header.token;
  console.log(url)
  this.body = request({
    url: url,
    method: 'get',
    headers: {'user-agent': REDDITUSERAGENT},
    auth: {bearer: token}
  }, (err, resp, body) => {
    if(err) console.log(err);
    return body;
  })
})

.get('/api/reddit/:subreddit/:type', function *(next) {
  let subReddit = this.params.subreddit;
  let type = this.params.type;
  let qs = this.querystring;
  let token = this.headers.token;

  this.body = request({
    url: `https://oauth.reddit.com/r/${subReddit}/${type}?${qs}` ,
    contentType: 'application/json',
    method: 'get',
    headers: {'user-agent': REDDITUSERAGENT},
    auth: {bearer: token}
  }, (err, resp, body) => {
    return body;
  });
})

app
.use(router.routes())
.use(function*(next) {
  this.path = '/index.html';
  yield Send(this, this.path, { root: __dirname + '/../dst' });
})
.use(router.allowedMethods({throw: true}))
.use(staticDir)
.listen(3000);