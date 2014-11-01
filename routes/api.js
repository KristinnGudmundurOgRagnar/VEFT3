'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

require('../models/kodemon')

var Entry = mongoose.model('Entry');

var db = require('../db');
db.connectToMongo();


/*
 * List all keys (without any values) that have been sent to the server.
 * With the method you would see a list of all the methods
 * that have been sending messages to the server.
 */
router.get('/keys', function(req, res) {
    Entry.find("key", function(err, entries) {
        if (err) 
        {
            console.error(err);
            res.send(404);
        }
        
        console.log(entries);
        res.send(entries);
    })
});


/* 
 * List all execution times for a given key.
 */
router.get('/key/:key_id/execution_time', function(req, res) {
    var key_id = req.params.key_id;

    Entry.find({ key: key_id }, 'execution_time', function (err, entries) { 
         if (err) 
        {
            console.error(err);
            res.send(404);
        }
        
        console.log(entries);
        res.send(entries);
    });
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