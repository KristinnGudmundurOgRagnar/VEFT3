'use strict';


var express = require('express');
var router = express.Router();

var mongoose =  require("mongoose");

require('../models/kodemon')

var Entry = mongoose.model('Entry');


var connectToMongo = function(){
    mongoose.connect("mongodb://localhost", {keepAlive: 1});
    console.log("Connecting to mongoose");
}

var onMongoConnection = function(){
    console.log("Connection to mongoose successful");
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
}

mongoose.connection.on("disconnected", connectToMongo);
mongoose.connection.on("connected", onMongoConnection);
connectToMongo();


/*
 * List all keys (without any values) that have been sent to the server.
 * With the method you would see a list of all the methods
 * that have been sending messages to the server.
 */
router.get('/keys', function(req, res) {
    Entry.find(function (err, entries) {
        if (err)
        {
            console.error(err);
            res.send(err);
        }
        else
        {
            console.log(entries)
            res.send(entries);
        }
    })
});


/* 
 * List all execution times for a given key.
 */
router.get('/key/:key_id/execute_time', function(req, res) {
    var key_id = req.params.key_id;

    res.send([{
        'key': key_id
    }]);
    //res.json([{'key': key_id}]);
    /*process.nextTick(function () {
		callback(null, [
			{key: key_id}]
			);
	});*/
});

/*
 * List all execution times, for a given key on a given time range.
 */
router.get('/key/:key_id/execute_time/:time', function(req, res) {
    var key_id = req.params.key_id;
    var time_id = req.params.time;

    res.send([{
        'key': key_id,
        'time': time_id
    }]);
    /*res.json([{
		'key': key_id,
		'time': time_id
		}]);*/
    /*process.nextTick(function () {
    callback(null, [
      {key: key_id, time: time_id }]
    );
  });*/
});

module.exports = router;