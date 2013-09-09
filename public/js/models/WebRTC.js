namespace("Brain");

Brain.WebRTC = Backbone.Model.extend({

	pc: undefined,

	type: undefined,

	to: undefined, //who we are connecting to

	us: undefined, //our address


	dataConnection: undefined,

	//the connection used to setup this connection
	transport: undefined, 

	initializeRTC: function(){

		var servers = undefined;

		this.pc = new RTCPeerConnection(servers);

		// this.dataChannel = this.pc.createDataChannel("data");
		this.pc.ondatachannel = this.onDataChannel.createDelegate(this);

		this.pc.onicecandidate = this.onIceCandidate.createDelegate(this);

		this.pc.onaddstream = this.onAddStream.createDelegate(this);

		if(this.type == "server"){
			// this.pc.createAnswer(
			// 	this.gotDescription.createDelegate(this)
			// );
		}else if(this.type == "client"){
			
			// this.pc.addStream(); //we will have the stream

			this.pc.createOffer(
				this.gotDescription.createDelegate(this)
			);
		}
	},


	onCandidiateMessage: function(event){
		
		if(this.pc == undefined){
			this.initializeRTC();
		}

		var data = event.data;

		var signal = JSON.parse(data);

		//dk why this happens
		if(signal.message == null 
			|| signal.message == "null"
		){
			// this.pc.addIceCandidate( null );
			return;
		}
		this.pc.addIceCandidate(new RTCIceCandidate(JSON.parse( signal.message )));
	}, 	

	onIceCandidate: function(event){

		console.log("onIceCandidate ", event.candidate);

		// ((this.type == "server") ? "answer" : "offer")

		this.transport.send(
			{
				request: "iceCandidate_from_" + this.type, 
				to: this.to,
				from: this.us,
				message: JSON.stringify( event.candidate )
			}
		);
	},

	onAddStream: function(event){

		//when a stream gets added
		console.log("onAddStream =======================");


		//new video for each stream
		var vid = $("<video autoplay=\"true\"></video>");
		$("#videos").append(vid);

		attachMediaStream( vid[0], event.stream );

		var aid = $("<audio autoplay=\"true\"></audio");
		$("#videos").append(aid);
		attachMediaStream( aid[0], event.stream );

		// attachMediaStream( $("video#remote")[0], event.stream);

	},

	gotDescription: function(desc){

		console.log("WebRTC: gotDescription", this.to, this.us);

		console.log("this.pc.setLocalDescription");
		this.pc.setLocalDescription(desc);

		// ((this.type == "server") ? "answer": "offer")

		this.transport.send({
			"request": "sdp_from_" + this.type,
			"to" : this.to,
			"from" : this.us,
			"message": JSON.stringify(desc) 
		});
	}, 

	onDataChannel: function(event){

		this.dataConnection = event.channel;

		this.trigger("channelReady");
	}

})