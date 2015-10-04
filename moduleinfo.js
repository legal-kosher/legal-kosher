var fs = require('fs');
var _ = require('underscore');
var parseModule = require('./parse');
var spawn = require('child_process').spawn;
var prc = spawn('npm', ['ls', '--json', '--long']);
var data = '';
var includes = ["name", "version", "licenses", "license", "dependencies"];
var modules;
var stringify = require('json-stringify-safe');


module.exports = function(app) {

  app.get('/data', function(req, res, next) {

    prc.stdout.setEncoding('utf8');
    prc.stdout.on('data', function(chunk) {
      data += chunk;
    });

    prc.stdout.on('end', function(info) {
      var parsedObject = JSON.parse(data);
      console.log(parsedObject);

      function reduceObject(obj) {
        _.each(obj, function(item, key, list) {
          if (includes.indexOf(key) === -1) {
            delete obj[key];
          }
        })
        _.each(obj['dependencies'], reduceObject);
      }
      reduceObject(parsedObject);
      parseModule(parsedObject, req, res);


      var test = stringify(parsedObject);
      res.send({
        data: test
      });

    });

    prc.on('close', function(code) {
      // console.log('process exit code ' + code);
    });
  });
}