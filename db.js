'use strict';

var mongoose = require("mongoose");

exports.connectToMongo = function(){
	mongoose.connect("mongodb://localhost", {keepAlive: 1});
	console.log("Connecting to mongoose");
}

exports.onMongoConnection = function(){
	console.log("Connection to mongoose successful");
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
}