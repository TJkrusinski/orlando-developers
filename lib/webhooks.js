'use strict'; 

var path = require('path');
var query = require('querystring');
var concat = require('concat-stream');
var request = require('request');

var BASE_HOOK_URL = 'https://hooks.slack.com/services/';

/**
 *  Handle the invite user web hook
 *
 *  @param {Object} req
 *  @param {Object} res
 *  @returns {undefined}
 */

exports.invite = function(req, res) {
  req.pipe(concat({ encoding: 'string' }, handleBody));

  /**
   *  After we concat the incoming body, do stuff to it
   *
   *  @param {String} body
   *  @returns {undefined}
   */

  function handleBody(body) {
    body = query.parse(body);

    var valid = validateToken(body.token);
    var statusCode = valid ? 200 : 403;
    var responseBody = valid ? 'Thanks!' : 'Not Authorized';

    res.writeHead(statusCode, {
      'content-type': 'text/plain',
      'content-length': Buffer.byteLength(responseBody)
    });

    res.end(responseBody);

    exports.sendToChannel('#admins')({
      'text': body.user_name + ' wants to invite: ' + body.text
    });
  };
};

/**
 *  Compare the incoming token against what is set in the env
 *
 *  @param {String} value
 *  @returns {String}
 */

function validateToken(value) {
  return value == process.env.SLACK_INVITE_TOKEN;
};

/**
 *  Send a message to a channel
 *
 *  @param {String} [channel] - if need be, specify a channel
 *  @returns {Function}
 */

exports.sendToChannel = function(channel) {

  /**
   *  Return a closure around the channel specified
   *
   *  @param {Object} payload
   *  @param {Function} cb
   */

  return function(payload, cb) {
    if (!process.env.SLACK_OUTGOING_HOOK_TOKEN)
      throw new Error('No outgoing slack webhook token defined');

    cb = cb || function() {};

    var url = BASE_HOOK_URL + process.env.SLACK_OUTGOING_HOOK_TOKEN;

    if (channel) payload.channel = channel;

    request({
      url: url,
      method: 'POST',
      body: payload,
      json: true
    }, function(err, res, body) {
      cb(err, body);
    });
  };
};
