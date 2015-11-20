;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'ViewController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$scope", "$state", "$interval",
        function ViewController($scope, $state, $interval) {
            $scope.state = $state;
            BG.setStateProvider($state);
            
            $scope.changePlayerView = function() {
                $scope.state.changePlayerMode();
                console.log('cpv');
            }
            
            $scope.togleTabs = function() {
                $scope.state.togleTabs();
                console.log('tt');
            }
            
            $interval(function() {
               $scope.state = $state;
            }, 500);
        }
    ]);
})();