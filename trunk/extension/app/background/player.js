;var Player = (function () {
	
    soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	
	var playingSound;
	var playList;
    
    function Playlist() {
        return {
			id: -1,
			name: "",
			index: 0,
			sounds:[]
		};
    }
    
	function Player() {
        
        this.state = {
            volume:  50,
            isMute:  false,
            isRandom:  false,
            onPause:  false,
            loadingSound:  false
        }
        
		this.sound = {
			id: -1,
            loading: false,
			title: ".........",
			duration: 1000,
			position: 0,
            dynamicURL: false,
            url: "",
            playMe: function() {
            }
		};
        
		this.customProperty = {
			
		}
	};

	Player.prototype.setPlayList = function(id, name, sounds, firstPage) {
		if (firstPage) {
            playList = new Playlist();
            playList.id = id;
		    playList.name = name;
            playList.index = 0;
			playList.sounds = sounds;
		} else {
			playList.sounds.push(sounds);
		}
	}
	
	Player.prototype.playSoundById = function(soundId) {
		playList.index = -1;
		for (var i in playList.sounds) {
			if (playList.sounds[i].id == soundId) {
				playList.index = i;
				break;
			}
		}
		doPlay.call(this);
	}

	Player.prototype.play = function () {
		doPlay.call(this);
	}

	Player.prototype.next = function () {
		doNext.call(this);
	}

	Player.prototype.prev = function () {
		doPrev.call(this);
	}

	Player.prototype.stop = function () {
		doStop.call(this);
	}

	Player.prototype.toggle = function () {
		doToggle.call(this);
	}

	Player.prototype.setPosition = function(position) {
		if (typeof playingSound !== "undefined") {
			playingSound.setPosition(position);
		}
	}
	
	Player.prototype.setVolume = function(volume) {
		this.state.volume = volume;
		if (typeof playingSound !== "undefined") {
			playingSound.setVolume(this.state.volume);
		}
	}

	Player.prototype.setRandomPlaying = function() {
		this.state.isRandom = true;
	}
    
    Player.prototype.setLoopPlaying = function() {
		this.state.isRandom = false;
	}

	Player.prototype.mute = function() {
		this.state.isMute = !this.state.isMute;
		if (this.state.isMute) {
			playingSound.setVolume(0);
		} else {
			playingSound.setVolume(this.state.volume);
		}
	}
	
	var doPlay = function () {
        var player = this;
		doStop.call(player);
        console.log(player.loadingSound);
		var sound = playList.sounds[playList.index];
        if(sound.dynamicURL) {
            sound.playMe(function(url) {
                sound.url = url;
                createCurrentSound.call(player, sound);
            });
        } else {
            createCurrentSound.call(player, sound);
        }
	}

    var createCurrentSound = function(sound) {
        var player = this;
        playingSound = soundManager.createSound({
			url: sound.url,
			onPlay: function() {
				player.sound.id = sound.id;
                player.loadingSound = true;
			},
			onload: function () {
				player.sound.title = sound.title;
				player.sound.duration = playingSound.duration;
				player.onPause = false;
                player.loadingSound = false;
                console.log(player.loadingSound);
			},
			onfinish: function () {
				doNext.call(player);
			},
			whileplaying: function () {
				player.sound.position = playingSound.position;
			}
		});
        var volume = 0;
        if (!player.state.isMute) {
            volume = player.state.volume;
        }
		playingSound.setVolume(volume);
		playingSound.play();
    }

	var doStop = function () {
		if (typeof playingSound !== "undefined") {
			playingSound.destruct();
		}
	}
	
	var doNext = function () {
        var player = this;
		var next = playList.index + 1;
        if (player.state.isRandom) {
            next = 0; //random
        }    
		if (next >= playList.sounds.length) {
			playList.index = 0;
		} else {
			playList.index = next;
		}
		doPlay.call(player);
	}

	var doPrev = function () {
        var player = this;
		var prev = playList.index - 1;
        if (player.state.isRandom) {
            next = 0; //random
        }   
		if (prev < 0) {
			playList.index = playList.sounds.length - 1;
		} else {
			playList.index = prev;
		}
		doPlay.call(player);
	}
	
	var doToggle = function () {
        var player = this;
		if (typeof playingSound !== "undefined") {
			playingSound.togglePause();
			player.state.onPause = playingSound.paused;
		}
	}
    
    return Player;
})();