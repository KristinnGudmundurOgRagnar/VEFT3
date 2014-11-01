var dgram = require("dgram");

var mongoose = require("mongoose");

/*
var connectToMongo = function(){
	mongoose.connect("mongodb://localhost", {keepAlive: 1});
	console.log("Connecting to mongoose");
}

var onMongoConnection = function(){
	console.log("Connection to mongoose successful");
}

mongoose.connection.on("disconnected", connectToMongo);
connectToMongo();
*/


var server = dgram.createSocket("udp4");

server.on("message", function(msg, rinfo){
  console.log('got message from client: ' + msg);
});

server.on('listening', function(){
  console.log('Kodemon server listening on')
  console.log('hostname: ' + server.address().address);
  console.log('port: ' + server.address().port);
});

server.bind(4000);