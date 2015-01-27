'use strict';

var http = require('http');
var st = require('st');

var port = process.env.PORT || 3000;
var stOpts = {
  // this is where metalsmith dumps the files
  path: 'build',
  // tell st to use `build/index.html` for `GET /`
  index: './index.html',
  gzip: true
};

// don't cache stuff if in development
if (process.env.NODE_ENV == 'development') {
  stOpts.cache = false;
};

/**
 *  A wee little server, just right for our needs
 */

http.createServer(st(stOpts)).listen(port, function() {
  console.log('Orlando developers server listening on port %s', port);
});
