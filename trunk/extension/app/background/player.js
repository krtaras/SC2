;var Player = (function () {
	
    soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	
	var playingSound;
	var items;
    var itemIndex;
    function Item() {
        return {
			type:'',
            object:{}
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
            art: "",
			duration: 1000,
			position: 0,
            dynamicURL: false,
            url: "",
            playMe: function() {
            }
		};
        
        this.playList = {
            id: -1,
            title: ".........",
            art: "",
            index: 0,
            sounds: []
        }
        
		this.customProperty = {
			
		}
        items = [];
        itemIndex = 0;
	};
    
    Player.prototype.setItem = function(list) {
       items = list;
    }

	Player.prototype.setPlayList = function(id, name, sounds, firstPage) {
		if (firstPage) {
            this.playList.id = id;
		    this.playList.name = name;
            this.playList.index = 0;
			this.playList.sounds = sounds;
		} else {
			this.playList.sounds.push(sounds);
		}
        var item = new Item();
        item.type = 'pl';
        item.object = this.playList;
        items = [];
        items.push(item);
	}
	
	/*Player.prototype.playSoundById = function(soundId) {
		this.playList.index = -1;
		for (var i in playList.sounds) {
			if (playList.sounds[i].id == soundId) {
				playList.index = i;
				break;
			}
		}
		doPlay.call(this);
	}*/

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
	
    Player.prototype.getPlaylistSounds = function() {
        return this.playList.sounds;
    }
    
	var doPlay = function () {
        var player = this;
		doStop.call(player);
        console.log(player.state.loadingSound);
		var sound = getSound.call(player);
        if(sound.dynamicURL) {
            sound.playMe(function(url) {
                sound.url = url;
                createCurrentSound.call(player, sound);
            });
        } else {
            createCurrentSound.call(player, sound);
        }
	}

    var getSound = function() {
        var player = this;
        item = items[itemIndex];
        if (item.type == 'pl') {
            var pl = item.object;
            if (pl.id == player.playList.id) {
                return player.playList.sounds[player.playList.index];
            }
        } else {
            return item.object;
        }
    }

    var createCurrentSound = function(sound) {
        var player = this;
        playingSound = soundManager.createSound({
			url: sound.url,
			onPlay: function() {
				player.sound.id = sound.id;
                player.state.loadingSound = true;
			},
			onload: function () {
				player.sound.title = sound.title;
				player.sound.duration = playingSound.duration;
				player.onPause = false;
                player.state.loadingSound = false;
                console.log(player.state.loadingSound);
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
        var changeIndex = true;
        if (items[itemIndex].type == 'pl') {
            var next = player.playList.index + 1; 
            if (next >= player.playList.sounds.length && items.length == 1) {
                player.playList.index = 0;
            } else {
                if (next < player.playList.sounds.length) {
                    player.playList.index = next;
                    changeIndex = false;
                } else {
                    itemIndex++;
                }
            }
        } else {
            itemIndex++;
        }
        if (changeIndex) {
            if (player.state.isRandom) {
                itemIndex = 0; //random
            }    
            if (itemIndex >= items.length) {
                itemIndex = 0;
            }
        }
		doPlay.call(player);
	}

	var doPrev = function () {
        var player = this;
        var changeIndex = true;
        if (items[itemIndex].type == 'pl') {
            var prev = player.playList.index - 1; 
            if (prev < 0 && items.length == 1) {
                player.playList.index = player.playList.sounds.length - 1;;
            } else {
                if (prev >= 0) {
                    player.playList.index = prev;
                    changeIndex = false;
                } else {
                    itemIndex--;
                }
            }
        } else {
            itemIndex--;
        }
        if (changeIndex) {
            if (player.state.isRandom) {
                itemIndex = 0; //random
            }    
            if (itemIndex < 0) {
                itemIndex = items.length - 1;
            }
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