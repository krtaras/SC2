;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TabsController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
    var APIHelper = chrome.extension.getBackgroundPage().apiHelper;
    app.controller(controllerName, ["$interval",
        function TabsController($interval) {
            var tc = this;
            
            this.sound = Player.sound;
            this.list = Player.getItemsList();
            
            this.search = function() {  
                APIHelper.searchSounds('nightcore', function(result) {
                    console.log(result);
                    var sounds = []
                    for (var i in result) {
                        sounds.push({
                            type: 'sound',
                            id: result[i].id,
                            loading: false,
                            title: result[i].title,
                            art: result[i].artwork_url,
                            duration: result[i].duration,
                            position: 0,
                            dynamicURL: true,
                            url: "",
                            playMe: function(calback) {
                                APIHelper.getTrackURL(this.id, function(url) {
                                    console.log(url);
                                    calback(url);
                                });
                            }
                        });
                    }
                    Player.setPlayList(-1, 'test', sounds, true);
                    tc.list = Player.getItemsList();
                });
            }
        }
    ]);
})();