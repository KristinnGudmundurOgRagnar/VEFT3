'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

require('../models/kodemon')

var Entry = mongoose.model('Entry');

var db = require('../db');
db.connectToMongo();

mongoose.set('debug', true);


/*
 * List all keys (without any values) that have been sent to the server.
 * With the method you would see a list of all the methods
 * that have been sending messages to the server.
 */
router.get('/keys', function(req, res) {
    Entry.distinct('key', function(err, entries) {
        if (err) {
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
router.get('/key/:key_id/execution_time/page/:number', function(req, res) {
    var key_id = req.params.key_id;

    Entry.find({
        $query: {
            key: key_id
        },
        $orderby: {
            timestamp: -1
        }
    }, {}, {
        skip: parseInt(req.params.number),
        limit: 25
    }, function(err, entries) {
        if (err) {
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
router.get('/key/:key_id/execution_time/:startTime/:endTime/page/:number', function(req, res) {
    var key_id = req.params.key_id;
    var startTime = parseInt(req.params.startTime);
    var endTime = parseInt(req.params.endTime);

    Entry.find({
        $query: {
            key: key_id,
            timestamp: {
                $gte: startTime,
                $lte: endTime
            }

        },
        $orderby: {
            timestamp: -1
        },
    }, 'key timestamp execution_time', function(err, entries) {
        if (err)
            res.status(500).send(err)

        res.send(entries);
    });
});

module.exports = router;