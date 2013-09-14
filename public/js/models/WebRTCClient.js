namespace("Brain");

Brain.WebRTCClient = Brain.WebRTC.extend({

	type: "client", 

	initialize: function(options){

		this.to = options.to;

		this.us = options.us;

		this.transport = options.transport;

		this.onAnswerMessage = this.onAnswerMessage.createDelegate(this);
		this.onCandidiateMessage = this.onCandidiateMessage.createDelegate(this);

		this.transport.once("message", this.onAnswerMessage);
		this.transport.on("message", this.onCandidiateMessage);

		//initialize the RTC
		this.trigger("initializeRTC", [this]);
		this.initializeRTC();
	}, 

	// sdp [Session Description Protocol] answer
	onAnswerMessage: function(event ){
		console.log("WebRTCClient: onAnswerMessage");

		if(event.message.request !== "sdp_from_server" 
			|| "" + event.message.to !== "" + this.us
			|| "" + event.message.toConnection !== "" + this.usConnection
		){
			//message wasn't ment for us, 
			//we should probably rebind our event
			// console.error(
			// 	"onAnswerMessage returned unexpected paramaters, ",
			// 	event.message.request, 
			// 	event.message.to
			// );
			
			this.transport.once("message", this.onAnswerMessage);

			return;
		}

		var message = event.message.message;

		var sdp = JSON.parse(message);
		this.pc.setRemoteDescription(
			new RTCSessionDescription( sdp )
		);

		return false;
	}
});
