#!/usr/local/bin/node

/*jshint sub: true*/
/*jshint loopfunc: true */
/*jshint newcap: false */
/*jshint multistr: true */
/*jshint expr: true */
/*jshint esnext: true */

"use strict";

// SERVER FOR REACT APP

var CONF  = require('/r_m/nodejs/config.js').settings();
// var fs    = require('fs');
// var asc   = require(CONF.my_modules + 'asc.js');
// var wf    = require(CONF.my_modules + 'wf.js');
// var db    = require(CONF.my_modules + 'usedb.js');
// var time  = require(CONF.my_modules + 'time.js');
// var color = require(CONF.my_modules + 'color.js');
// var err_trace = require(CONF.my_modules + 'err_trace.js');
var log   = console.log;

// var Articles = require (CONF.oft_modules + 'Articles.js');

// var CONTEXT = require('/r_m/nodejs/my/context.js').add_set_get({});

var express = require('express');
var app = express();

app.set('port', 3000);
app.use('/', express.static(__dirname));

app.listen(app.get('port'), () => {
  log('Server started: http://127.0.0.1/:' + app.get('port') + '/');
});