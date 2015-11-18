;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'playerController';
    app.controller(controllerName, ["$scope", "$interval",
        function PlayerController($scope, $interval) {
            var isMinimized = false;
            $scope.typeView = "/extension/app/view/player-max.html";
            
            $scope.changeView = function() {
                $scope.typeView = isMinimized ? "/extension/app/view/player-max.html" : "/extension/app/view/player-min.html";
                isMinimized = !isMinimized;
            }
        }
    ]);
})();