    SC.initialize({
		client_id: 'c0e833fecbe9557b9ba8e676b4786b3a'
	});
	
	SC.stream('/tracks/65257361').then(function(player){
  		SCPlayer = player;
	});
	
	var isInitialized = false;
	var playerState;
	var index = 0;
	
	this.setPlayerState = function(provider) {
		try {
			playerState = provider;
			isInitialized = true;
			SCPlayer.on('time', function() {
				console.log(playerState.state.volume);
				SCPlayer.setVolume(playerState.state.volume / 100.0);
			});
		} catch (e) {
			
		}
		
	}
	
	this.isInitialized = function() {
		return isInitialized;
	}
	
	this.getPlayerState = function() {
		return playerState.state;
	}
    
    //https://api.soundcloud.com/tracks/65257361/stream