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
            this.currentUser = APIHelper.currentUser;
            this.sound = Player.sound;
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
                            dynamicURL: false,
                            url: result[i].uri + '/stream?client_id=c0e833fecbe9557b9ba8e676b4786b3a',
                            playMe: function(calback) {
                            }
                        });
                    }
                    Player.setSounds(sounds, true);
                    tc.list = Player.getItemsList();
                    setTimeout(function() {
                        $('#loading').html('');
                    }, 500);
                });
            }
            this.playSound = function(id) {
                Player.playSoundById(id);
            }
            $interval(function() {
               if (tc.sound.id != selectedSoundId) {
                   $('#list').scrollTop($('#list').scrollTop() + $('#list').find('#'+tc.sound.id).offset().top - $('#list').offset().top - 10);
                   selectedSoundId = tc.sound.id;
               }
            }, 1000);
        }
    ]);
})();