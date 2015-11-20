;var BackGround = new (function() {
	var isInitialized = false;
	var stateProvider;
	var index = 0;
	
	this.setStateProvider = function(provider) {
		stateProvider = provider;
		isInitialized = true;
	}
	
	setInterval(function (){
		index++;
		console.log(index);
		if (isInitialized) {
			stateProvider.updatePosition(index);
		}
	}, 1000);
})();