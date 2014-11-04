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

        console.log(entries);
        res.json(entries);
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
        }, 'key timestamp execution_time', {
            skip: parseInt(req.params.number),
            limit: maxLimit
        },

        function(err, entries) {
            if (err) {
                res.status(404).send(err);
            }

            res.json(entries);
        });
});


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


    //var query = Entry.find(queryString);

    query.count(function(err, count) {
        if (err)
            res.send(err);
        res.json(count);
    })

    /*var countThis = (startTime ? Entry.find({
            $query: {
                key: key_id,
                timestamp: {
                    $gte: startTime,
                    $lte: endTime
                }
            }
        }) :
        Entry.find(getValue));

    countThis.count(countThis, function(err, entries) {
        console.log('Count is ' + entries);
        if (err) {
            res.status(404).send(err);
        }
        res.json(entries);
    });*/
});

module.exports = router;