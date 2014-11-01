var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var KodemonSchema = new Schema({
    execution_time: Number,
    timestamp: Number,
    token: String,
    key: String
});

mongoose.model('Entry', KodemonSchema);