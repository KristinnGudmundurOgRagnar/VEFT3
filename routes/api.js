'use strict';


var express = require('express');
var router = express.Router();

/*
 * List all keys (without any values) that have been sent to the server. 
 * With the method you would see a list of all the methods 
 * that have been sending messages to the server.
 */
router.get('/listAll', function(req, res) {
	//res.json([{'key': 'Nothing'}]);
});


/* 
 * List all execution times for a given key.
*/
router.get('/listAllExecution/:key_id', function(req, res) {
	var key_id = req.params.key_id;

	res.send([{
		'key': key_id}]);
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
router.get('/listAllExecutionTime/:key_id/:time', function(req, res) {
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