
loadCoreDependencies = function(cb){
	requier([
		
		basePath + "/js/helpers/Function.js"
	], function(){

		cb();
	})
}