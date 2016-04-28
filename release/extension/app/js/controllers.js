/*!
 * SoundCloudPlayer v2.0.0 (https://github.com/krtaras/SC2#readme)
 * Copyright 2015-2016 
 * Licensed under the ISC license
 */
;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'HomeTabController';
    var Player = chrome.extension.getBackgroundPage().Player;
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, ["$interval",
        function HomeTabController($interval) {
            var tc = this;
            var selectedSoundId = -1;
            var isInitialized = true;
            
            console.log('homeTab');
            
            this.currentUser = APIHelper.currentUser;
            this.sound = Player.sound;
            this.playlist = Player.playList;
            this.list = Player.getItemsList();
            this.searchText = '';
            
            this.onenter = function(keyEvent) {
                if (keyEvent.which === 13)
                    tc.search();
            }
            
            this.search = function() {
                tc.list = [];
                SCHelper.drawObjects($('#loading'),
                    APIHelper.searchSounds(tc.searchText, function(result) {
                        isInitialized = false;
                        var sounds = []
                        for (var i in result) {
                            sounds.push(getSoundObject(result[i], false));
                        }
                        tc.list = sounds;
                    })
                );
            }
            
            this.stream = function() {
                tc.list = [];
                SCHelper.drawObjects($('#loading'),
                    APIHelper.getMyActivities(function(result){
                        isInitialized = false;
                        var list = [];
                        for (var i in result) {
                            var object = result[i];
                            if (object.type == 'track') {
                                list.push(getSoundObject(object.origin, false));
                            } else {
                                if (object.type == 'playlist') {
                                    var playlist = SCHelper.buildPlayListObject(object.origin);
                                    APIHelper.getSoundsFromPlayList(playlist, function(playlist, result) {
                                        for (var i in result) {
                                            playlist.sounds.push(getSoundObject(result[i], true));
                                        }
                                    });
                                    list.push(playlist);
                                }
                            }
                        }
                        tc.list = list;
                    })
                );
            }
            
            this.getCharts = function() {
                tc.list = [];
                SCHelper.drawObjects($('#loading'),
                    APIHelper.getCharts(function(result) {
                        isInitialized = false;
                        var list = [];
                        for (var i in result) {
                            var sound = result[i].track;
                            if (sound) {
                                list.push(getSoundObject(sound, false));
                            }
                        }
                        tc.list = list;
                    })
                );
            }
            
            this.playSound = function(id, plId) {
                if (!isInitialized) {
                    Player.setItems(this.list, true);
                    isInitialized = true;
                }
                if (plId == -1) {
                    Player.playSoundById(id);
                } else {
                    Player.playSoundFromPlayListById(id, plId);
                }
                
            }
            
            this.goToSoundCloud = function(id) {
                
            }
            
            this.getDownloadUrl = function(id) {
                return APIHelper.getTrackURL(id);
            }
            
            var getSoundObject = function(object, inPlaylist) {
                return SCHelper.buildSoundObject(object, inPlaylist);
            }
            
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
            
            this.goToSoundCloud = function(id) {
                
            }
            
            this.getDownloadUrl = function(id) {
                return APIHelper.getTrackURL(id);
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
;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TracksTabController';
    var APIHelper = chrome.extension.getBackgroundPage().APIHelper;
    var SCHelper = chrome.extension.getBackgroundPage().SCHelper;
    app.controller(controllerName, ["$interval",
        function TracksTabController($interval) {
            var ttc = this;
            var selectedSoundId = -1;
            var isInitialized = true;
            
            console.log('trackTab');
                     
            this.myTracks = function() {
                var controller = angular.element($('#list')).scope().itemsController;
				controller.setItems( 
                    APIHelper.searchSounds('anime', function(result) {
                        isInitialized = false;
                        var sounds = []
                        for (var i in result) {
                            sounds.push(getSoundObject(result[i], false));
                        }
                        return sounds;
                    })
               );
            }
            
            this.faworites = function() {
                
            }
            
            var getSoundObject = function(object, inPlaylist) {
                return SCHelper.buildSoundObject(object, inPlaylist);
            }
        }
    ]);
})();