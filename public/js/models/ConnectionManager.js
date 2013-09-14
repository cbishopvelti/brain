namespace("Brain");

/*
 responsible for managing active connections.
*/
Brain.ConnectionManager = Backbone.Collection.extend({

	connection: undefined,

	initialize: function(options){

	}, 

	//gets a random connection
	getTransport: function(){

		return _.sample(this.models);
	}


});

