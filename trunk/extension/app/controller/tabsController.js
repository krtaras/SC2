;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TabsController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$interval",
        function TabsController($interval) {
            this.list = [];
            
            this.search = function() {
                BG.playerService.getTracks('nightcore', function(sounds) {
                   var controller = angular.element(document.getElementById('tabsController')).scope().tabsController;
                   controller.list = sounds;
                });
            }
        }
    ]);
})();