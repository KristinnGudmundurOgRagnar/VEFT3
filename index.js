var dgram = require("dgram");

var mongoose = require("mongoose");

require('./models/kodemon')

Entry = mongoose.model('Entry');


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

function addToMongo(msg){

  var thisEntry = new Entry({ message: msg + "lol" })

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
  //addToMongo(msg)
  drop();
  getAllMongos();


/*
	var JSONmsg = JSON.parse(msg);
	console.log('got message from client: ' + JSONmsg);
	
	//Retrieve the fields from the message
	var executionTime = JSONmsg.execution_time;
	var timeStamp = JSONmsg.timestamp;
	var token = JSONmsg.token;
	var key = JSONmsg.key;*/
});

server.on('listening', function(){
	console.log('Kodemon server listening on')
	console.log('hostname: ' + server.address().address);
	console.log('port: ' + server.address().port);
});

server.bind(4000);