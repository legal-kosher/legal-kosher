//setup Dependencies
var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var port = 8008;
var router = require('../router');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));
app.use(cors());


// connect to DB and fire up server. 
var config = 'mongodb://127.0.0.1:27017/legal-kosher' // this should be in a config file... 
mongoose.connect(config, function(err) {
  if (err) console.log(err)
  var server = http.createServer(app);
});

router(app);

var server = http.createServer(app);
server.listen(port);

console.log('Listening on:' + port);