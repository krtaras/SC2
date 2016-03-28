;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TracksTabController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
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