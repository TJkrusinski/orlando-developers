'use strict';

var http = require('http');
var st = require('st');
var webhooks = require('./lib/webhooks');

var port = process.env.PORT || 3000;
var stOpts = {
  // this is where metalsmith dumps the files
  path: 'build',
  // tell st to use `build/index.html` for `GET /`
  index: './index.html',
  gzip: true
};

// don't let st cache stuff if in development
if (process.env.NODE_ENV == 'development') {
  stOpts.cache = false;
};

/**
 *  A wee little server, just right for our needs
 */

http.createServer(function(req, res){

  // TODO: maybe move to a framework, idk
  if (req.url.toLowerCase() == '/invite' && req.method == 'POST') {
    webhooks.invite(req, res);
  } else if (req.url.toLowerCase() == '/admin' && req.method == 'POST') {
    webhooks.admin(req, res);
  } else {
    st(stOpts)(req, res); 
  };

}).listen(port, function() {
  console.log('Orlando developers server listening on port %s', port);
});
