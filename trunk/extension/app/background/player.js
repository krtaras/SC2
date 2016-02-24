var Player = (function () {
	
    soundManager.setup({
		url: '/app/lib/',
		flashVersion: 9,
		onready: function () {
		}
	});
	
	var playingSound;
	
	function Player() {
        
        this.volume = 50;
        this.isMute = false;
        this.isRandom = false;
        this.onPause = false,
        
		this.sound = {
			id: -1,
			title: "",
			duration: 1000,
			position: 0
		};

		this.playlist = {
			id: -1,
			name: "",
			index: 0,
			sounds:[]
		};
        
		this.customProperty = {
			
		}
	};

	Player.prototype.setPlayList = function(id, name, sounds, firstPage) {
		if (firstPage) {
            this.playlist.id = id;
		    this.playlist.name = name;
            this.playlist.index = 0;
			this.playlist.sounds = sounds;
		} else {
			this.playlist.sounds.push(sounds);
		}
	}
	
	Player.prototype.playSoundById = function(soundId) {
		this.playlist.index = -1;
		for (var i in this.playlist.sounds) {
			if (this.playlist.sounds[i].id == soundId) {
				this.playlist.index = i;
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

	this.setPosition = function(position) {
		if (typeof playingSound !== "undefined") {
			playingSound.setPosition(position);
		}
	}
	
	this.setVolume = function(volume) {
		this.player.volume = volume;
		if (typeof playingSound !== "undefined") {
			playingSound.setVolume(this.player.volume);
		}
	}

	this.setRandomPlaying = function(isRandom) {
		this.player.isRandom = isRandom;
	}

	this.mute = function() {
		this.player.isMute = !this.player.isMute;
		if (this.player.isMute) {
			playingSound.setVolume(0);
		} else {
			playingSound.setVolume(this.player.volume);
		}
	}
	
	var doPlay = function () {
		doStop();
		var sound = this.playlist.items[this.playlist.index];
		playingSound = soundManager.createSound({
			url: sound.url,
			onPlay: function() {
				Player.sound.id = sound.id;
			},
			onload: function () {
				Player.sound.title = sound.title;
				Player.sound.duration = playingSound.duration;
				this.player.onPause = false;
			},
			onfinish: function () {
				doNext();
			},
			whileplaying: function () {
				Player.sound.position = playingSound.position;
			}
		});
		playingSound.setVolume(this.player.volume);
		playingSound.play();
	}

	var doStop = function () {
		if (typeof playingSound !== "undefined") {
			playingSound.destruct();
		}
	}
	
	var doNext = function () {
		var next = this.playlist.index + 1;
		if (next >= this.playlist.items.length) {
			if (this.player.isLoop) {
				this.playlist.index = 0;
			}
		} else {
			this.playlist.index = next;
		}
		doPlay();
	}

	var doPrev = function () {
		var prev = this.playlist.index - 1;
		if (prev < 0) {
			if (this.player.isLoop) {
				this.playlist.index = this.playlist.items.length - 1;
			}
		} else {
			this.playlist.index = prev;
		}
		doPlay();
	}
	
	var doToggle = function () {
		if (typeof playingSound !== "undefined") {
			playingSound.togglePause();
			this.player.onPause = playingSound.paused;
		}
	}
})();
Player.customProperty = {
	isOpenedPlayList:true,
	openTab: "my"
};