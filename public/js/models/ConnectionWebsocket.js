namespace("Brain");

/*
 initial websocket connection with the server, responsible for 
 setting up the first webRTC connection
*/
Brain.ConnectionWebsocket = Brain.Connection.extend({

	socket: undefined,

	type: undefined, 

	initialize: function(options){

		this.set("type", "websocket");
		this.set("to", "0"); //this is the server

		this.socket = new WebSocket("ws://localhost:8124/", "echo");

		this.socket.onopen = this.onOpen.createDelegate(this);

		this.socket.onclose = this.onClose.createDelegate(this);

		this.socket.onmessage = this.onMessage.createDelegate(this);

		this.socket.onerror = this.onError.createDelegate(this);
	}, 

	send: function(message){
		var message = this.preSend(message);

		this.socket.send( message );
	},

	onOpen: function(){
		console.log("onOpen");
	}, 

	onClose: function(){

		console.log("onClose");
	}, 

	onError: function(event){
		
		console.log( "onError", event );
	}


});
