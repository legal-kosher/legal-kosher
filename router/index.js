var getData = require('../moduleinfo');
var mongoose = require('mongoose');
var models = require('../models');
var Data = mongoose.model('Data');

module.exports = function(app) {
  // frontend
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
  });

  // internal only
  getData(app);

  //receive data from client
  app.post('/post', function(req, res, next) {
    Data.create({
      data: req.body
    }, function(err, data) {
      if (err) console.log(err)
      else console.log(data);
      res.send(201, {
        data: data
      })
    })

  })

  // for testing: get all data entries from DB
  app.get('/get', function(req, res, next) {
    Data.find({}, function(err, data) {
      console.log(data);
      res.send(data);
    })
  })

  app.get('/get/ids', function(req, res, next) {
    Data.find({}, '_id', function(err, data) {
      console.log(data);
      res.send(data);
    })
  })

  app.get('/get/:id', function(req, res, next) {
    Data.find({
      _id: req.params.id
    }, function(err, data) {
      console.log(data);
      res.send(data);
    })
  })

}