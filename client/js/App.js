
basePath = "/client";

var startApplication = function(){

	//everything is loaded, start the app
}

require([
	basePath + "/RequireLib.js", 
	basePath + "/RequireCore.js",
], function(){
	loadLibDependencies(
		function(){
			loadCoreDependencies(function(){
				startApplication
			})
		}
	);
})
