;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'TracksTabController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
    var APIHelper = chrome.extension.getBackgroundPage().apiHelper;
    app.controller(controllerName, ["$interval",
        function TracksTabController($interval) {
            
        }
    ]);
})();