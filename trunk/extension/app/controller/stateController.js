;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'StateController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$scope",
        function StateController($scope) {
            $scope.currentUser = BG.currentUser;            
            $scope.loginPage = '/extension/app/view/login.html';
            $scope.playerPage = '/extension/app/view/player.html';
        }
    ]);
})();