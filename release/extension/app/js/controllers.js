/*!
 * SoundCloudPlayer v2.0.0 (https://github.com/krtaras/SC2#readme)
 * Copyright 2015-2016 
 * Licensed under the ISC license
 */
//@ sourceURL=tracksTabController.js
; (function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'HomeTabController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, [
        function HomeTabController() {
            var htc = this;
            console.log('homeTab');

            this.searchText = '';

            this.onenter = function (keyEvent) {
                if (keyEvent.which === 13)
                    htc.search();
            }

            this.search = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.searchSounds(htc.searchText, function (result) {
                        var sounds = []
                        for (var i in result) {
                            sounds.push(getSoundObject(result[i], false));
                        }
                       return sounds;
                    })
                );
            }

            this.stream = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                   APIHelper.getMyActivities(function (result) {
                        var list = [];
                        for (var i in result) {
                            var object = result[i];
                            if (object.type == 'track') {
                                list.push(getSoundObject(object.origin, false));
                            } else {
                                if (object.type == 'playlist') {
                                    var playlist = getPlayListObject(object);
                                    APIHelper.getSoundsFromPlayList(playlist, function (playlist, result) {
                                        for (var i in result) {
                                            playlist.sounds.push(getSoundObject(result[i], true));
                                        }
                                    });
                                    list.push(playlist);
                                }
                            }
                        }
                        return list;
                    })
                );
            }

            this.getCharts = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.getCharts(function (result) {
                        var list = [];
                        for (var i in result) {
                            var sound = result[i].track;
                            if (sound) {
                                list.push(getSoundObject(sound, false));
                            }
                        }
                        return list;
                    })
                );
            }

            var getSoundObject = function (object, inPlaylist) {
                return SCHelper.buildSoundObject(object, inPlaylist);
            }

            var getPlayListObject = function(object) {
                return  SCHelper.buildPlayListObject(object.origin);
            }
        }
    ]);
})();
;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'ItemsController';
    var Player = chrome.extension.getBackgroundPage().Player;
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, ["$interval",
        function ItemsController($interval) {
            var tc = this;
            var selectedSoundId = -1;
            var isInitialized = true;
            
            this.currentUser; // = APIHelper.currentUser;
            this.sound; // = Player.sound;
            this.playlist; // = Player.playList;
            this.list = []; // = Player.getItemsList();
            
            this.init = function() {
                if (Player.customProperty.activeTabName == chrome.extension.getBackgroundPage().PlayerHelper.view.activeTabName) {
                    this.construct();
                    var scrollTop = $interval(function() {
                        if (tc.sound.id != selectedSoundId) {
                            SCHelper.scrollToSound($('#list'), tc.sound.id, tc.sound.inPlaylist, tc.playlist.id);
                            selectedSoundId = tc.sound.id;
                        }
                    }, 1000);
                    
                    $('#list').on('$destroy', function() {
                        $interval.cancel(scrollTop);
                    });
                }
            }
            
            this.construct = function() {           
                this.currentUser = APIHelper.currentUser;
                this.sound = Player.sound;
                this.playlist = Player.playList;
                this.list = Player.getItemsList();
            }   
            
            
            this.setItems = function(callback) {
                SCHelper.drawObjects($('#loading'),
                    callback.then(function(data){
                        tc.list = data;
                        isInitialized = false;
                        return true;
                    })
                );
            }
            
            this.playSound = function(id, plId) {
                if (!isInitialized) {
                    Player.setItems(this.list, true);
                    isInitialized = true;
                    Player.customProperty.activeTabName = chrome.extension.getBackgroundPage().PlayerHelper.view.activeTabName;
                    this.init();
                }
                if (plId == -1) {
                    Player.playSoundById(id);
                } else {
                    Player.playSoundFromPlayListById(id, plId);
                }
            }
            
            this.doLikeTrack = function(id) {
                setLikeForSound(id, true);
                Player.setLikeForSound(id, true);
                APIHelper.doLikeTrack(id, function(data) {
                });
            }
            
            this.doUnLikeTrack = function(id) {
                setLikeForSound(id, false);
                Player.setLikeForSound(id, false);
                APIHelper.doUnLikeTrack(id, function(data) {
                });
            }
            
            this.goToSoundCloud = function(id) {
                
            }
            
            this.getDownloadUrl = function(id) {
                return APIHelper.getTrackURL(id);
            }
            
            var setLikeForSound = function(soundId, like) {
                var items = tc.list;
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
        }
    ]);
})();
;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'LoginController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    app.controller(controllerName, ["$scope",
        function LoginController($scope) {
            $scope.skip = function() {
                APIHelper.loginAsGuest();
            }
            
            $scope.signIn = function() {
                APIHelper.connect();
            }
        }
    ]);
})();
;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var Player = chrome.extension.getBackgroundPage().Player;
    var PlayerHelper = chrome.extension.getBackgroundPage().PlayerHelper;
    app.controller(controllerName, ["$interval",
        function PlayerController($interval) {
            var pc = this;
            
            this.view = PlayerHelper.view;
            this.tabsList = PlayerHelper.tabsList;
            this.player = Player;
            this.volumeIcon = "";
            
            this.changePlayerViewMode = function() {
                if (PlayerHelper.view.isMinimized) {
                    PlayerHelper.maximize();
                } else {
                    PlayerHelper.minimize();
                }
            }
            
            this.toggleTabs = function() {
                if (PlayerHelper.view.isTabsOpened) {
                    PlayerHelper.closeTabs();
                } else {
                    PlayerHelper.openTabs();
                }
            }
            
            this.openHomeTab = function() {
                PlayerHelper.openHomeTab();
            }
            this.openTracksTab = function() {
                PlayerHelper.openTracksTab();
            }
            this.openPlayListTab = function() {
                PlayerHelper.openPlayListTab();
            }
            this.openSettingsTab = function() {
                PlayerHelper.openSettingsTab();
            }
            
            this.muteVolume = function() {
                 Player.mute();
                 updateVolumeIcon();
            }
            
            this.updateVolume = function() {
                 Player.setVolume(Player.state.volume);
                 Player.state.isMute = false;
                 updateVolumeIcon();
            };
            
            this.updatePosition = function() {
                Player.setPosition(Player.sound.position);
            }
            
            this.play = function() {
                if (Player.state.onPause) {
                    Player.toggle();
                } else {
                    Player.play();
                }
            }
            
            this.stop = function() {
                Player.stop();
            }
            
            this.toggle = function() {
                Player.toggle();
            }
            
            this.next = function() {
                Player.next();
            }
            
            this.prev = function() {
                Player.prev();
            }
            
            this.replay = function() {
                Player.play();
            }
            
            this.toggleRandom = function() {
                Player.toggleRandomPlaying();
            }
            
            function updateVolumeIcon() {
                if (Player.state.isMute) {
                    pc.volumeIcon = "volume_off";
                } else {
                    if (Player.state.volume > 50) {
                         pc.volumeIcon = "volume_up";
                    } else {
                        if (Player.state.volume == 0) {
                             pc.volumeIcon = "volume_mute";
                        } else {
                             pc.volumeIcon = "volume_down";
                        }
                    }
                }
            }
            
            function setActiveTab() {
                var plaingTab = Player.customProperty.activeTabName;
                if (plaingTab) {
                    switch (plaingTab) {
                        case PlayerHelper.tabsList.tracksTabName:  
                            pc.openTracksTab();                     
                            break;
                        case PlayerHelper.tabsList.playListsTabName:   
                            pc.openPlayListTab();                    
                            break; 
                        case PlayerHelper.tabsList.settingsTabName:  
                            pc.openSettingsTab();                     
                            break;
                        default:
                            pc.openHomeTab();
                            break;
                    }
                }
            }
            
            updateVolumeIcon();
            setActiveTab();
            $interval(function() {
               //$scope.player = $player;
            }, 0);
        }
    ]);
})();
//@ sourceURL=tracksTabController.js
; (function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayListTabController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, [
        function PlayListTabController() {
            
            console.log('playListTab');
            
            this.myPlaylists = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.getMyPlaylists(function (result) {
                        var list = [];
                        for (var i in result) {
                            var object = result[i];
                            buildPlayList(object, list);
                        }
                        return list;
                    })
                );
            }

            this.favoritesPlaylists = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.getMyFavoritePlaylists(function (result) {
                        var list = [];
                        for (var i in result) {
                            var object = result[i].playlist;
                            if(object) {
                                buildPlayList(object, list);
                            }
                        }
                        return list;
                    })
                );
            }

            var buildPlayList = function (object, list) {
                var playlist = getPlayListObject(object);
                var tracks = object.tracks;
                if (!playlist.art || playlist.art == "") {
                    if (tracks.length > 0) {
                        var first = tracks[0];
                        if (first.artwork_url || first.artwork_url != "") {
                            playlist.art = first.artwork_url
                        }
                    }
                }
                for (var i in tracks) {
                    var track = tracks[i];
                    if (!track.artwork_url || track.artwork_url == "") {
                        track.artwork_url = playlist.art;
                    }
                    playlist.sounds.push(getSoundObject(track, true));
                }
                list.push(playlist);
            }

            var getSoundObject = function (object, inPlaylist) {
                return SCHelper.buildSoundObject(object, inPlaylist);
            }
            
            var getPlayListObject = function(object) {
                return  SCHelper.buildPlayListObject(object);
            }
        }
    ]);
})();

;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'StateController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    app.controller(controllerName, ["$scope",
        function StateController($scope) {
            $scope.currentUser = APIHelper.currentUser;      
            $scope.loginPage = '/extension/app/view/login.html';
            $scope.playerPage = '/extension/app/view/player.html';
        }
    ]);
})();
//@ sourceURL=tracksTabController.js
; (function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TracksTabController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, [
        function TracksTabController() {
            
            console.log('trackTab');
            
            this.myTracks = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.getMyTracks(function (result) {
                        var sounds = []
                        for (var i in result) {
                            sounds.push(getSoundObject(result[i], false));
                        }
                        return sounds;
                    })
                );
            }

            this.favorites = function () {
                var controller = angular.element($('#list')).scope().itemsController;
                controller.setItems(
                    APIHelper.getMyFavorites(function (result) {
                        var sounds = []
                        for (var i in result) {
                            sounds.push(getSoundObject(result[i], false));
                        }
                        return sounds;
                    })
                );
            }

            var getSoundObject = function (object, inPlaylist) {
                return SCHelper.buildSoundObject(object, inPlaylist);
            }
        }
    ]);
})();