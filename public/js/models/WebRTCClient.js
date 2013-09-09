namespace("Brain");

Brain.WebRTCClient = Brain.WebRTC.extend({

	type: "client", 

	initialize: function(options){

		this.to = options.to;

		this.us = options.us;

		this.transport = options.transport;

		this.onAnswerMessage = this.onAnswerMessage.createDelegate(this);
		this.onCandidiateMessage = this.onCandidiateMessage.createDelegate(this);

		this.transport.on("message", this.onCandidiateMessage);
		this.transport.once("message", this.onAnswerMessage);

		//initialize the RTC
		this.initializeRTC();
	}, 

	// sdp [Session Description Protocol] answer
	onAnswerMessage: function(event ){
		console.log("WebRTCClient: onAnswerMessage");

		if(event.message.request !== "" 
			|| "" + event.message.to !== "" + this.us
		){
			//message wasn't ment for us, 
			//we should probably rebind our event
			console.error("onAnswerMessage returned unexpected paramaters");
			return;
		}

		var message = JSON.parse(event.message.message);

		var sdp = JSON.parse(message);
		this.pc.setRemoteDescription(
			new RTCSessionDescription( sdp )
		);

		return false;
	}
});
