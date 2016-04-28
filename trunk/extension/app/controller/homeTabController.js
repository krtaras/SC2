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