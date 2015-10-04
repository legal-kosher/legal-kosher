var mongoose = require('mongoose');

var schema = mongoose.Schema({
  data: Object,
  timestamp: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Data', schema);