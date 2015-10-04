var fs = require('fs');
var _ = require('underscore');
var parseModule = require('./parse');
var spawn = require('child_process').spawn;
var prc = spawn('npm', ['ls', '--json', '--long']);
var data = '';
var includes = ["name", "version", "licenses", "license", "dependencies"];
var modules;
// read config
// var config = fs.readFile('./legal-config.json', 'utf-8', function(err, data) {
//   if (err) console.log('Err readfile config.json:', err);
//   else console.log((data));
// })

module.exports = function(app) {

  app.get('/data', function(req, res, next) {

    prc.stdout.setEncoding('utf8');
    prc.stdout.on('data', function(chunk) {
      data += chunk;
    });

    prc.stdout.on('end', function(info) {
      var parsedObject = JSON.parse(data);

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



    });

    prc.on('close', function(code) {
      console.log('process exit code ' + code);
      // console.log(modules);
      // res.send({
      //   data: modules
      // });
    });
  });
}