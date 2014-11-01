var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var KodemonSchema = new Schema({
    executionTime: Number,
    timeStamp: Number,
    token: String,
    key: String
});

mongoose.model('Entry', KodemonSchema);