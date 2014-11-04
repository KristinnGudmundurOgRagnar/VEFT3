'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

require('../models/kodemon')

var Entry = mongoose.model('Entry');

var db = require('../db');
db.connectToMongo();

mongoose.set('debug', true);

var maxLimit = 25;


/*
 * List all keys (without any values) that have been sent to the server.
 * With the method you would see a list of all the methods
 * that have been sending messages to the server.
 */
router.get('/keys', function(req, res) {
    Entry.distinct('key', function(err, entries) {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        }

        console.log(entries);
        res.json(entries);
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
        limit: maxLimit
    }, function(err, entries) {
        if (err) {
            console.error(err);
            res.status(404).send(err);
        }

        //console.log(entries);
        res.json(entries);
    });
});

/*
 * List all execution times, for a given key on a given time range.
 *
 * Usage:
 * GET /key/<key_id>/execution_time/<startTime>/<endTime>/page/<number>
 * 
 * Example:
 * /key/somefile.py-someFunction/
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
        }, 'key timestamp execution_time', {
            skip: parseInt(req.params.number),
            limit: maxLimit
        },

        function(err, entries) {
            if (err) {
                res.status(404).send(err);
            }
            //console.log(entries);
            res.json(entries);
        });
});


/*
 * Get total queries from table, queries from 
 * given key_id and queries from given key_id and
 * startTime and endTime
 * 
 * Usage:
 * GET /total/
 * GET /total/<key_id>/
 * GET /total/<key_id>/<startTime>/<endTime>
 * 
 * Example:
 * /total/
 * /total/somefile.py-someFunction/
 * /total/somefile.py-someFunction/1000000/2000000
 * 
 * Can be run without <key_id> and <startTime> and <endTime>
 * together.
 */
router.get('/total/:key_id?/:startTime?/:endTime?', function(req, res) {
    var key_id = req.params.key_id;
    var startTime = parseInt(req.params.startTime);
    var endTime = parseInt(req.params.endTime);
    var query;

    if (key_id) {
        if (startTime) {
            query = Entry.find({
                'key': key_id,
                timestamp: {
                    $gte: startTime,
                    $lte: endTime
                }
            });
        } else
            query = Entry.find({
                'key': key_id
            });
    } else {
        query = Entry.find({});
    }

    query.count(function(err, count) {
        if (err)
            res.send(err);
        //console.log(entries);
        res.json(count);
    })
});

module.exports = router;