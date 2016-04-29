/*!
 * SoundCloudPlayer v2.0.0 (https://github.com/krtaras/SC2#readme)
 * Copyright 2015-2016 
 * Licensed under the ISC license
 */
//@ sourceURL=APIHelper.js
; var APIHelper = (function (SC) {

    var client_id = 'c0e833fecbe9557b9ba8e676b4786b3a';
    var connectionURL = 'https://soundcloud.com/connect?client_id=c0e833fecbe9557b9ba8e676b4786b3a&redirect_uri=http%3a%2f%2fkrtaras.github.io%2fsound-cloud%2fcallback.html&response_type=token&scope=non-expiring';
    var access_token = '';


    var isGuest = false;
    var isLoginned = false;
    var scUser = false;

    SC.initialize({
        client_id: 'c0e833fecbe9557b9ba8e676b4786b3a',
    });

    function APIHelper() {
        this.currentUser = {
            isGuest: false,
            isLoginned: false,
            scUser: false
        };
    }

    APIHelper.prototype.loginAsGuest = function () {
        var api = this;
        isGuest = true;
        isLoginned = true;
        api.currentUser.isLoginned = isLoginned;
        api.currentUser.isGuest = isGuest;
    }

    APIHelper.prototype.connect = function () {
        var api = this;
        chrome.tabs.create({ url: connectionURL, selected: true }, function (tab) {
            var authTabId = tab.id;
            chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo) {
                if (tabId == authTabId && changeInfo.url != undefined && changeInfo.status == "loading") {
                    if (changeInfo.url.indexOf('access_token') > -1) {
                        access_token = getParam('#access_token', changeInfo.url);
                        if (access_token != null && access_token != '') {
                            SC.initialize({
                                client_id: 'c0e833fecbe9557b9ba8e676b4786b3a',
                                oauth_token: access_token
                            });
                            isLoginned = true;
                            scUser = true;
                            isGuest = false;
                        }
                        api.currentUser.isLoginned = isLoginned;
                        api.currentUser.isGuest = isGuest;
                        api.currentUser.scUser = scUser;
                        chrome.tabs.remove(tabId, function () { });
                    }
                }
            });
        });
    }

    APIHelper.prototype.searchSounds = function (searchStr, callback) {
        return callGetAPI('/tracks', { q: searchStr, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getMyActivities = function (callback) {
        return callGetAPI('/me/activities', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data.collection);
        });
    }

    APIHelper.prototype.getCharts = function (callback) {
        return $.getJSON('https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aall-music&client_id=' + client_id + '&limit=200')
            .then(function (data) {
                return callback(data.collection);
            });
    }

    APIHelper.prototype.getMyTracks = function (callback) {
        return callGetAPI('/me/tracks', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getMyFavorites = function (callback) {
        return callGetAPI('/me/favorites', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getSoundsFromPlayList = function (playlist, callback) {
        return callGetAPI('/playlists/' + playlist.id + '/tracks', { oauth_token: access_token }, function (data) {
            return callback(playlist, data);
        });
    }

    APIHelper.prototype.getMyPlaylists = function (callback) {
        return callGetAPI('/me/playlists', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }
    
    APIHelper.prototype.getMyFavoritePlaylists = function (callback) {
        return callGetAPI('/e1/me/playlist_likes', {oauth_token: access_token, limit: 200,}, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doUnLikeTrack = function (trackId, callback) {
        return callDeleteAPI('/me/favorites/' + trackId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doLikeTrack = function (trackId, callback) {
        return callPutAPI('/me/favorites/' + trackId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doUnLikePlaylist = function (playListId, callback) {
        return callDeleteAPI('/e1/me/playlist_likes/' + playListId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doLikePlaylist = function (playListId, callback) {
        return callPutAPI('/e1/me/playlist_likes/' + playListId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getCompleteURL = function (url) {
        return url + '/stream?client_id=' + client_id;
    }

    APIHelper.prototype.getTrackURL = function (trackId) {
        return 'https://api.soundcloud.com/tracks/' + trackId + '/stream?client_id=' + client_id;
    }

    function callGetAPI(str, params, callback) {
        return SC.get(str, params).then(callback);
    }

    function callPutAPI(str, params, callback) {
        return SC.put(str, params).then(callback);
    }

    function callDeleteAPI(str, params, callback) {
        return SC.delete(str, params).then(callback);
    }

    function getParam(param, url) {
        var vars = {};

        url.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi,
            function (m, key, value) {
                vars[key] = value !== undefined ? value : '';
            }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }

    return APIHelper;
})(SC);
//@ sourceURL=Player.js
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
    
	function Player() {
        
        this.state = {
            volume:  50,
            isMute:  false,
            isRandom:  false,
            onPause:  false,
            loadingSound:  false,
            isPlaying: false
        }
        
		this.sound = {
            type: 'sound',
			id: -1,
            inPlaylist: false,
			title: ".........",
            art: "",
			duration: 1000,
			position: 0,
            dynamicURL: false,
            url: "",
            playMe: function() {
            },
            marked: false
		};
        
        this.playList = {
            type: 'playlist',
            id: -1,
            title: ".........",
            art: "",
            index: 0,
            marked: false,
            sounds: []
        }
        
		this.customProperty = {
			
		}
        items = [];
        itemIndex = 0;
	};
	
    Player.prototype.setItems = function(list, replace) {
        if (replace) {
            items = [];
        }
        for (var i in list) {
            items.push(list[i]);
        }
    }
    
	Player.prototype.playSoundById = function(soundId) {
		for (var i in items) {
            var item = items[i];
            if (item.type == 'sound') {
                if (item.id == soundId) {
                    itemIndex = parseInt(i);
                    break;
                }
            }
        }
		doPlay.call(this);
	}
    
    Player.prototype.playSoundFromPlayListById = function(soundId, playlistId) {
        var stopSearch = false;
        for (var i in items) {
            var item = items[i];
            if (item.type == 'playlist') {
                var sounds = item.sounds;
                if (item.id == playlistId) {
                    for (var j in sounds) {
                        if (sounds[j].id == soundId) {
                            stopSearch = true;
                            itemIndex = parseInt(i);
                            this.playList.id = item.id;
                            this.playList.name = item.name;
                            this.playList.index = parseInt(j);
                            this.playList.sounds = sounds;
                            break;
                        }
                    }
                }
                
                if (stopSearch) {
                    break;
                }
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
			playingSound.setPosition(position * playingSound.duration / 100);
		}
	}
	
	Player.prototype.setVolume = function(volume) {
		this.state.volume = volume;
		if (typeof playingSound !== "undefined") {
			playingSound.setVolume(this.state.volume);
		}
	}

	Player.prototype.toggleRandomPlaying = function() {
		this.state.isRandom = !this.state.isRandom;
	}

	Player.prototype.mute = function() {
		this.state.isMute = !this.state.isMute;
		if (this.state.isMute) {
			playingSound.setVolume(0);
		} else {
			playingSound.setVolume(this.state.volume);
		}
	}
	
    Player.prototype.getItemsList = function() {
        if (items.length == 1) {
            if (items[0].type == 'playlist') {
                return items[0].sounds;
            }
        }
        return items;
    }
    
    Player.prototype.setLikeForSound = function(soundId, like) {
        for (var i in items) {
            var item = items[i];
            if (item.type == 'sound') {
                if (item.id == soundId) {
                    item.marked = like;
                }
            }
            if (item.type == 'playlist') {
                var sounds = item.sounds;
                for (var j in sounds) {
                    if (sounds[j].id == soundId) {
                        sounds[j].marked = like;
                    }
                }
            }
        }
    }
    
	var doPlay = function () {
        var player = this;
		doStop.call(player);
		var sound = getSound.call(player);
        if (sound == null) {
            doNext.call(player);
        }
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
        var item = items[itemIndex];
        if (item.type == 'playlist') {
            if (item.sounds.length < 1) {
                return null;
            }
            if (item.id != player.playList.id) {
                 player.playList.id = item.id;
                 player.playList.name = item.name;
                 player.playList.sounds = item.sounds;
                 player.playList.index = 0;
            }
            return player.playList.sounds[player.playList.index];
        } else {
            return item;
        }
    }

    var createCurrentSound = function(sound) {
        var player = this;
        playingSound = soundManager.createSound({
			url: sound.url,
			onPlay: function() {
                player.state.loadingSound = true;
			},
			onload: function (success) {
                player.sound.id = sound.id;
				player.sound.title = sound.title;
                player.sound.art = sound.art;
                player.sound.inPlaylist = sound.inPlaylist;
				player.sound.duration = playingSound.duration;
				player.onPause = false;
                player.state.loadingSound = false;
                player.state.isPlaying = true;
                if (!success) {
                    removeCurrentSound.call(player);
                    doNext.call(player);
                }
			},
			onfinish: function () {
				doNext.call(player);
			},
			whileplaying: function () {
				player.sound.position = (playingSound.position * 100) / playingSound.duration;
			},
            ondataerror: function() {
                doNext.call(player);
            }
		});
        var volume = 0;
        if (!player.state.isMute) {
            volume = player.state.volume;
        }
		playingSound.setVolume(volume);
		playingSound.play();
    }

    var removeCurrentSound = function() {
        var player = this;
        var item = items[itemIndex];
        if (item.type == 'playlist') {
            var soundIndex = player.playList.index;
            item.sounds.splice(soundIndex, 1);
            player.playList.sounds.splice(soundIndex, 1);
        } else {
            items.splice(itemIndex, 1);
        }
    }

	var doStop = function () {
        var player = this;
		if (typeof playingSound !== "undefined") {
			playingSound.destruct();
		}
        player.state.isPlaying = false;
        player.state.onPause = false;
        player.sound.position = 0;
	}
	
	var doNext = function () {
        var player = this;
        var changeIndex = true;
        if (items[itemIndex].type == 'playlist') {
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
                itemIndex = getRandom();
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
        if (items[itemIndex].type == 'playlist') {
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
                itemIndex = getRandom();
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
    
    var getRandom = function() {
        var max = items.length-1;
        var index = Math.floor((Math.random() * max) + 1);
        return index;
    }
    
    return Player;
})();
//@ sourceURL=PlayerHelper.js
;var PlayerHelper = (function(){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html',
        homeTab: '/extension/app/view/homeTab.html',
        tracksTab: '/extension/app/view/tracksTab.html',
        playListTab: '/extension/app/view/playListTab.html',
        settingsTab: '/extension/app/view/settingsTab.html'
    }
    
    var homeTabName = "home";
    var tracksTabName = "traks";
    var playListsTabName = "playLists";
    var settingsTabName = "settings";
    
    function PlayerHelper() {
        this.view  = {
            isMinimized: false,
            isTabsOpened: false,
            viewURL: htmlUrls.max,
            tabsURL: '',
            activeTabName: homeTabName,
            activeTab: htmlUrls.homeTab,
        };
        this.tabsList = {
            homeTabName: "" + homeTabName,
            tracksTabName: "" + tracksTabName,
            playListsTabName: "" + playListsTabName,
            settingsTabName: "" + settingsTabName
        }
        updateState.call(this);
    };
    
    PlayerHelper.prototype.minimize = function() {
        this.view.isMinimized = true;
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    PlayerHelper.prototype.maximize = function() {
        this.view.isMinimized = false;
        updateState.call(this);
    }
    PlayerHelper.prototype.openTabs = function() {
        this.view.isTabsOpened = true;
        updateState.call(this);
    }
    PlayerHelper.prototype.closeTabs = function() {
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    PlayerHelper.prototype.openHomeTab = function() {
        this.view.activeTab = htmlUrls.homeTab;
        this.view.activeTabName = homeTabName;
    }
    PlayerHelper.prototype.openTracksTab = function() {
        this.view.activeTab = htmlUrls.tracksTab;
        this.view.activeTabName = tracksTabName;
    }
    PlayerHelper.prototype.openPlayListTab = function() {
        this.view.activeTab = htmlUrls.playListTab;
        this.view.activeTabName = playListsTabName;
    }
    PlayerHelper.prototype.openSettingsTab = function() {
        this.view.activeTab = htmlUrls.settingsTab;
        this.view.activeTabName = settingsTabName;
    }
    function updateState() {
        var ps = this;
        ps.view.viewURL = ps.view.isMinimized ? htmlUrls.min : htmlUrls.max;
        ps.view.tabsURL = ps.view.isTabsOpened ? htmlUrls.tabs : "" ;
    }
    return PlayerHelper;
})();
//@ sourceURL=SCHelper.js
;var SCHelper = (function() {
	
    var scExtemsionLoadingHtml = 
    '<div class="spinner"> \
        <div class="rect-1"></div> \
        <div class="rect-2"></div> \
        <div class="rect-3"></div> \
        <div class="rect-4"></div> \
        <div class="rect-5"></div> \
        <div class="rect-6"></div> \
        <div class="rect-7"></div> \
        <div class="rect-8"></div> \
    </div>';
    
    function SCHelper() {
        
    }
    
    SCHelper.prototype.drawObjects = function(loadingObj, apiCall) {
         loadingObj.html(scExtemsionLoadingHtml);
         apiCall.then(function() {
            setTimeout(function() {
                loadingObj.html('');
            }, 500);
         });
    }
    
    SCHelper.prototype.buildSoundObject = function(object, inPlaylist, calback) {
        var result = {
            type: 'sound',
            id: object.id,
            inPlaylist: inPlaylist,
            title: object.title,
            art: object.artwork_url,
            duration: object.duration,
            position: 0,
            dynamicURL: false,
            url: APIHelper.getCompleteURL(object.uri),
            playMe: function(calback) {
            },
            marked: ((object.user_favorite) ? true : false)
        }
        return result;
    };
    
    SCHelper.prototype.buildPlayListObject = function(object) {
        return {
            type: 'playlist',
            id: object.id,
            title: object.title,
            art: object.artwork_url,
            index: 0,
            sounds: []
        }
    }
    
    SCHelper.prototype.scrollToSound = function(listObj, soundId, inPlaylist, playlistId) {
        var topOffset = 0;
        if (inPlaylist) {
            if (listObj.find('#playlist-'+playlistId).find('#pl-sound-'+soundId).length > 0) {
                topOffset = listObj.find('#playlist-'+playlistId).find('#pl-sound-'+soundId).offset().top;
            }
        } else {
            if (listObj.find('#sound-'+soundId).length > 0) {
                topOffset = listObj.find('#sound-'+soundId).offset().top;
            }
        }
        var scrollTop = listObj.scrollTop() + topOffset - listObj.offset().top - 10;
        listObj.animate({ scrollTop: scrollTop+"px"});
    };
    
    return SCHelper;
})();
//@ sourceURL=background.js
;
var APIHelper = new APIHelper();
var Player = new Player();
var PlayerHelper = new PlayerHelper();
var SCHelper = new SCHelper();
