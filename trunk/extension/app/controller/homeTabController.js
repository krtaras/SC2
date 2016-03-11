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
                    var sounds = []
                    for (var i in result) {
                        sounds.push({
                            type: 'sound',
                            id: result[i].id,
                            inPlaylist: false,
                            title: result[i].title,
                            art: result[i].artwork_url,
                            duration: result[i].duration,
                            position: 0,
                            dynamicURL: false,
                            url: result[i].uri + '/stream?client_id=c0e833fecbe9557b9ba8e676b4786b3a',
                            playMe: function(calback) {
                            }
                        });
                    }
                    //Player.setSounds(sounds, true);
                    //tc.list = Player.getItemsList();
                    tc.list = sounds;
                    isInitialized = false;
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
                            list.push({
                                type: 'sound',
                                id: object.origin.id,
                                inPlaylist: false,
                                title: object.origin.title,
                                art: object.origin.artwork_url,
                                duration: object.origin.duration,
                                position: 0,
                                dynamicURL: false,
                                url: object.origin.uri + '/stream?client_id=c0e833fecbe9557b9ba8e676b4786b3a',
                                playMe: function(calback) {
                                }
                            });
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
                                        playlist.sounds.push({
                                            type: 'sound',
                                            id: result[i].id,
                                            inPlaylist: true,
                                            title: result[i].title,
                                            art: result[i].artwork_url,
                                            duration: result[i].duration,
                                            position: 0,
                                            dynamicURL: false,
                                            url: result[i].uri + '/stream?client_id=c0e833fecbe9557b9ba8e676b4786b3a',
                                            playMe: function(calback) {
                                            }
                                        });
                                    }
                                });
                                list.push(playlist);
                            }
                        }
                    }
                    setTimeout(function() {
                        $('#loading').html('');
                    }, 500);
                    tc.list = list;
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