;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'HomeTabController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
    var APIHelper = chrome.extension.getBackgroundPage().apiHelper;
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
                $('#loading').html(scExtemsionLoadingHtml);
                APIHelper.searchSounds(tc.searchText, function(result) {
                    isInitialized = false;
                    var sounds = []
                    for (var i in result) {
                        sounds.push(getSoundObject(result[i], false));
                    }
                    tc.list = sounds;
                    setTimeout(function() {
                        $('#loading').html('');
                    }, 500);
                });
            }
            
            this.stream = function() {
                tc.list = [];
                $('#loading').html(scExtemsionLoadingHtml);
                APIHelper.getMyActivities(function(result){
                    isInitialized = false;
                    var list = [];
                    for (var i in result) {
                        var object = result[i];
                        if (object.type == 'track') {
                            list.push(getSoundObject(object.origin, false));
                        } else {
                            if (object.type == 'playlist') {
                                if (object.origin.id == 94062096) {
                                    console.log(object);
                                }
                                var playlist = {
                                    type: 'playlist',
                                    id: object.origin.id,
                                    title: object.origin.title,
                                    art: object.origin.artwork_url,
                                    index: 0,
                                    sounds: []
                                };
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
                    setTimeout(function() {
                        $('#loading').html('');
                    }, 500);
                });
            }
            
            this.getCharts = function() {
                tc.list = [];
                $('#loading').html(scExtemsionLoadingHtml);
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
                    setTimeout(function() {
                        $('#loading').html('');
                    }, 500);
                });
            }
            
            this.playSound = function(id, plId) {
                if (!isInitialized) {
                    Player.setItems(this.list, true);
                    console.log('initialize...');
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
                return {
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
                    }
                }
            }
            
            var scrollTop = $interval(function() {
               if (tc.sound.id != selectedSoundId) {
                   var topOffset = 0;
                   if (tc.sound.inPlaylist) {
                       if ($('#list').find('#p'+tc.playlist.id).find('#ps'+tc.sound.id).length > 0) {
                            topOffset = $('#list').find('#p'+tc.playlist.id).find('#ps'+tc.sound.id).offset().top;
                       }
                   } else {
                       if ($('#list').find('#s'+tc.sound.id).length > 0) {
                            topOffset = $('#list').find('#s'+tc.sound.id).offset().top;
                       }
                   }
                   
                   $('#list').scrollTop($('#list').scrollTop() + topOffset - $('#list').offset().top - 10);
                   selectedSoundId = tc.sound.id;
               }
            }, 1000);
            
            $('#list').on('$destroy', function() {
                $interval.cancel(scrollTop);
                console.log('stoppedScroll');
            });
        }
    ]);
})();