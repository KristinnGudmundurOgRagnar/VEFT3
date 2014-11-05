var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	mongoosastic = require("mongoosastic");

var KodemonSchema = new Schema({
    execution_time: {type: Number, es_indexed: true},
    timestamp: {type: Number, es_indexed: true},
    token: {type: String, es_indexed: true},
    key: {type: String, es_indexed: true}
});

KodemonSchema.plugin(mongoosastic);

var Entry = mongoose.model('Entry', KodemonSchema),
stream = Entry.synchronize();

Entry.createMapping(function(err, mapping){
	if(err){
		console.log("Error creating mapping(you can safely ignore this)");
		console.log(err);
	}
	else{
		console.log("Mapping created");
		console.log(mapping);
	}
});