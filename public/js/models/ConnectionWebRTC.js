namespace("Brain");

/*
 webRTC connections
*/
Brain.ConnectionWebRTC = Brain.Connection.extend({

	initialize: function(options){

		if(_.isUndefined(options.us)){
			throw "options.us needs to be defined";
		}

		if(_.isUndefined(options.type)){
			
			options.type = "client";
		}

		if(options.type == "client"){

			if(_.isUndefined(options.to)){
				throw "options.to needs to be defined"
			}

			this.connection = new Brain.WebRTCClient(
				options // us, to, transport
			);
		}
	}

});