var dgram = require("dgram");

var mongoose = require("mongoose");

require('./models/kodemon')

Entry = mongoose.model('Entry');


var db = require('./db');

mongoose.connection.on("disconnected", db.connectToMongo);
mongoose.connection.on("connected", db.onMongoConnection);
db.connectToMongo();

function addToMongo(msg){

    var parsed = JSON.parse(msg);

    var thisEntry = new Entry(parsed);

    thisEntry.save(function (err, thisEntry) {
        if (err) return console.error(err);
    });
}
function drop()
{
    Entry.remove({},function(error){})
}
function getAllMongos()
{
    Entry.find(function (err, entries) {
        if (err) return console.error(err);
            console.log(entries)
    })
}
var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo){
    //console.log('got message from client: ' + msg);
    //drop();

	var JSONmsg = JSON.parse(msg);
	console.log('got message from client: ' + JSONmsg);
	
	//Retrieve the fields from the message
	var executionTime = JSONmsg.execution_time;
	var timeStamp = JSONmsg.timestamp;
	var token = JSONmsg.token;
	var key = JSONmsg.key;

    //addToMongo(executionTime, timestamp, token, key);
    addToMongo(msg);
    getAllMongos();
});

server.on('listening', function(){
	console.log('Kodemon server listening on')
	console.log('hostname: ' + server.address().address);
	console.log('port: ' + server.address().port);
});

server.bind(4000);