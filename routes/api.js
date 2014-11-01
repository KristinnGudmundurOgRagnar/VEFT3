'use strict';


var express = require('express');
var router = express.Router();

require('./models/kodemon')

Entry = mongoose.model('Entry');

/*
 * List all keys (without any values) that have been sent to the server.
 * With the method you would see a list of all the methods
 * that have been sending messages to the server.
 */
router.get('/keys', function(req, res) {
    Entry.find
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
router.get('/key/:key_id/:time', function(req, res) {
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