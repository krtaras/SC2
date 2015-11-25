;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'ViewController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$scope", "$player", "$interval",
        function ViewController($scope, $player, $interval) {
            $scope.player = $player;
            BG.setPlayerState($player);
            
            $scope.changePlayerViewMode = function() {
                $scope.player.changePlayerViewMode();
            }
            
            $scope.toggleTabs = function() {
                $scope.player.toggleTabs();
            }
            
            $interval(function() {
               $scope.player = $player;
            }, 500);
        }
    ]);
})();