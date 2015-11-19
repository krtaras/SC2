;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'ViewController';
    app.controller(controllerName, ["$scope", "$state",
        function ViewController($scope, $state) {
            $scope.state = $state;
            
            $scope.changePlayerView = function() {
                $scope.state.changePlayerMode();
                console.log('cpv');
            }
            
            $scope.togleTabs = function() {
                $scope.state.togleTabs();
                console.log('tt');
            }
        }
    ]);
})();