namespace("Brain");

Brain.WebRTCServer = Brain.WebRTC.extend({

	type: "server",

	initialize: function(options){

		console.log("WebRTCServer initialize");

		this.us = options.us;

		this.transport = options.transport;

		this.onOfferMessage = this.onOfferMessage.createDelegate(this);
		this.onCandidiateMessage = this.onCandidiateMessage.createDelegate(this);

		this.transport.on("message", this.onCandidiateMessage);
		this.transport.once("message", this.onOfferMessage);

		// this.initializeRTC(); //happens after we recieve an offer

	},

	initializeRTC: function(){

		Brain.WebRTC.prototype.initializeRTC.call(this);

	},

	// sdp [Session Description Protocol] offer
	onOfferMessage: function(event){

		if(event.message.request !== "sdp_from_client"
			|| "" + event.message.to !== "" + this.us
		){
			//this message isn't for us, 
			//this is once, so we should probably rebind our events
			console.error("onOfferMessage returned unexpected paramaters");
			return;
		}

		if(this.pc == undefined){
			console.log("initializeRTC");
			this.initializeRTC(); //Sends answer
		}
		

		var sdp = JSON.parse(event.message.message);

		console.log("this.pc.setRemoteDescription: ", sdp);
		this.pc.setRemoteDescription(
			new RTCSessionDescription( sdp )
		);

		//add stream and create answer
		this.pc.addStream(MyStream); //no stream

		this.pc.createAnswer(
			this.gotDescription.createDelegate(this)
		);

		return false;
	}
});
