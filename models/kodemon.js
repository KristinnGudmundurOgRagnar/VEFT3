var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var KodemonSchema = new Schema({
  message: String
});

mongoose.model('Entry', KodemonSchema);

