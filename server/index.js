var http = require('http');
var WebSocketServer = require('websocket').server;
var fs = require('fs');
var static = require('node-static');

require("../public/js/helpers/Function");

var _ = require("underscore")._; //add underscore

Backbone = require( "../public/js/vendor/backbone");
require("../public/js/models/Address");
require("../public/js/models/Addresses");

var webroot = './public/';
var port = 8124;

var file = new static.Server(webroot, { 
  cache: 1, 
  headers: { 'X-Powered-By': 'node-static' } 
});

console.log("file", file);

var server = http.createServer(function (request, response) {

	request.addListener('end', function(){
		file.serve(request, response, function(err){
			if(err !== null){
				//bad stuff happend
				console.log( "err: ", err, request.url );
			}
		});
	}).resume();

	// response.writeHead(200, {'Content-Type': 'text/plain'});
	// response.end('Hello World\n');

}).listen(port);

console.log('Server running at http://127.0.0.1:8124/');

var wsServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false
});

var addresses = new Brain.Addresses();

wsServer.on('request', function(request){

	var connection = request.accept('echo', request.origin);

	console.log("connections", addresses.length)

	var id;

	//start setting up connections
	if(connection.connected){

		//we are responsible for chosing the id
		id = _.uniqueId()

		connection.send(JSON.stringify({
			"request": "connected",
			"id": id 
		}));

		var address = new Brain.Address({
			id: id, 
			connection: connection
		});

		addresses.add( address );

	}else{
		throw "Not connected";
	}
	
	console.log("000", addresses.length);

	var what = "dave";

	connection.on("message", function(rawMessage){

		console.log("000.1", addresses.length);

		console.log(
			"rawMessage",
			rawMessage
		);

		rawMessage = rawMessage.utf8Data

		var message = JSON.parse(rawMessage);

		console.log( "message", message );

		if( ("" + message.to) === "0"){ //the message was sent to us
			switch(message.request){
				case "random_client": 


					var addresses2 = _.filter(addresses.models, function(item){


						return item.id != message.from
					});

					var randomConnection =  _.sample(addresses2);

					randomConnection = randomConnection || {};

					console.log("randomId: ", randomConnection.id );

					connection.send(JSON.stringify({
						"request": "random_client_response", 
						"id": randomConnection.id
					}));

					break;
			}
		}else if(( "" + message.to ) !== "0"){
			//send the message to the intender recipicante

			console.log( "addresses", addresses.length );

			var toConnection = _.find(addresses, function(item){

				console.log(
					"itemId: ", item.id, message.to
				);
				
				return "" + item.id === "" + message.to;
			});


			toConnection.get("connection").send(rawMessage); 
		}
	});

	 connection.on('close', function(reasonCode, description) {

	 	//remove the connection from the list, as it has been removed
	 	addresses.remove(id);

        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

console.log("websocket server");
