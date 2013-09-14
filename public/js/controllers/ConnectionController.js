namespace("Brain");

/*
 martialing the connection
*/
Brain.ConnectionController = Backbone.Model.extend({

	us: undefined,

	connectionManager: undefined, 

	initialize: function(options){

		//setup initial Websocket connection, to descover other websocket connections.
		this.connectionManager = new Brain.ConnectionManager(); //TODO: we havent used this yet

		window.connectionController = this; //DEBUG ONLY, remove
		window.connectionManager = this.connectionManager;


		//create the initial connection to the server. 
		var initialConnection = new Brain.ConnectionWebsocket();

		this.connectionManager.add(initialConnection);

		initialConnection.once(
			"message", 
			this.initialConnectionOnMessage.createDelegate(this, [initialConnection], true)
		);

		//connect to the cloud
		this.once("initialConnectionReady", 
			this.createConnectionFind.createDelegate(this, [initialConnection])
		);


		this.once("gotRandomClient", 
			this.createConnectionConnect.createDelegate(this, [initialConnection], true)
		)

	},

	/*
	 The server will first tell us who we are
	*/
	initialConnectionOnMessage: function( 
		event, 
		initialConnection 
	){

		console.log("ConnectionController: initialConnectionOnMessage", 
			event
		);

		if(event.message.request == "connected"){

			if(_.isUndefined( event.message.id ) ){
				console.error("we've been asigned undefined as our id");
			}
			this.us = event.message.id;

			initialConnection.set("us", event.message.id);

			console.log("ConnectionController: initialConnectionReady, us: ",
				this.us
			);

			this.trigger("initialConnectionReady");
			
		}else{
			throw "Expecting message with request connected to have been sent";
		}

		return false;
	},

	/*
	 responsible for establishing a connection
	*/
	createConnectionFind: function(transport){

		console.log( "ConnectionController: createConnectionFind" );

		transport.send({
			"request": "random_client", 
			"from": this.us, 
			"to": "0" //the root server
		});

		transport.once("message", function(event){
			if(event.message.request == "random_client_response"){

				this.trigger("gotRandomClient", event.message.id);
				return false;
			}else{
				throw "Expecting message with request randorm_client_response to have been sent";
			}
		}.createDelegate(this));
	}, 

	/*
	 connecting up clients
	*/
	createConnectionConnect: function(id, transport){

		console.log(
			"ConnectionController: createConnectionConnect"
		);


		//there is no other nodes yet, 
		if( "" + id == "0" || _.isUndefined(id) ){

		}else{
			var rtcClientConnection = new Brain.ConnectionWebRTC({
				"type": "client",
				"transport": transport, 
				"to": id, 
				"us": this.us, 
				"usConnection": _.uniqueId()
			})
			this.connectionManager.add(rtcClientConnection);
		}


		// console.log("001, ", _.sample( this.connectionManager.models ));


		//add a new server connection to listen for incoming connection requests
		var rtcServerConnection = new Brain.ConnectionWebRTC({
			"type": "server", 
			"us": this.us, 
			"usConneciton": _.uniqueId(),
			"transport": transport
		});

		this.connectionManager.add(rtcServerConnection);

	},
});
