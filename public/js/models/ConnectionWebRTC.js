namespace("Brain");

/*
 webRTC connections
*/
Brain.ConnectionWebRTC = Brain.Connection.extend({

	transport: undefined, 

	initialize: function(options){

		if(_.isUndefined(options.transport)){
			throw "options.transport is required"
		}
		//transport gets fed directly to WebRTCClient/WebRTCServer

		if(_.isUndefined(options.us)){
			throw "options.us needs to be defined";
		}

		if(_.isUndefined(options.usConnection)){
			throw "options.usConnection needs to be defined"
		}

		if(_.isUndefined(options.type)){
			
			options.type = "client";
		}

		options.transport.once("close", function(){
			//TODO: if the transport closes 
			//and we still need it, (ie we havent connected yet)
			//then destoy ourselfs & fire event for connectionController to 
			//ensure we are still well connected
			this.cleanUp();
		}.createDelegate(this));

		if(options.type == "client"){

			if(_.isUndefined(options.to)){
				throw "options.to needs to be defined"
			}

			this.connection = new Brain.WebRTCClient(
				options // us, usConnection, to, transport
			);
		}else{

			this.connection = new Brain.WebRTCServer(
				options //us, usConnection, transport
			);
		}
	},

	cleanUp: function(){
		//TODO
	}

});