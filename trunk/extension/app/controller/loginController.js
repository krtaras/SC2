;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'LoginController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, [
        function LoginController() {
            this.isLoginned = true;
            this.loginPage = '/extension/app/view/login.html';
        }
    ]);
})();