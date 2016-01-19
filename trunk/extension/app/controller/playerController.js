;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$scope", "$interval",
        function PlayerController($scope, $interval) {
            $scope.player = BG.playerState;
            
            $scope.changePlayerViewMode = function() {
                if (BG.playerState.state.isMinimized) {
                    BG.playerState.maximize();
                } else {
                    BG.playerState.minimize();
                }
            }
            
            $scope.toggleTabs = function() {
                if (BG.playerState.state.isTabsOpened) {
                    BG.playerState.closeTabs();
                } else {
                    BG.playerState.openTabs();
                }
            }
            
            $scope.$watch("player.state.volume", function() {
                 BG.playerState.setVolume(BG.playerState.state.volume);
            });
            
            $interval(function() {
               //$scope.player = $player;
            }, 500);
        }
    ]);
})();