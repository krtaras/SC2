;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'StateController';
    var APIHelper = chrome.extension.getBackgroundPage().apiHelper;
    app.controller(controllerName, ["$scope",
        function StateController($scope) {
            $scope.currentUser = APIHelper.currentUser;      
            $scope.loginPage = '/extension/app/view/login.html';
            $scope.playerPage = '/extension/app/view/player.html';
        }
    ]);
})();