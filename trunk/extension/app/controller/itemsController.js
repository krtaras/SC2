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