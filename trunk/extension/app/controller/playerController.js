;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$scope", "$interval",
        function PlayerController($scope, $interval) {
            $scope.player = BG.playerState;
            $scope.volumeIcon = "";
            
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
            
            $scope.muteVolume = function() {
                 BG.playerState.toggleMute();
                 updateVolumeIcon();
            }
            
            $scope.$watch("player.state.volume", function() {
                 BG.playerState.setVolume(BG.playerState.state.volume);
                 updateVolumeIcon();
            });
            
            function updateVolumeIcon() {
                if (BG.playerState.state.isMute) {
                    $scope.volumeIcon = "volume_off";
                } else {
                    if (BG.playerState.state.volume > 50) {
                         $scope.volumeIcon = "volume_up";
                    } else {
                        if (BG.playerState.state.volume == 0) {
                             $scope.volumeIcon = "volume_mute";
                        } else {
                             $scope.volumeIcon = "volume_down";
                        }
                    }
                }
            }
            
            updateVolumeIcon();
            
            $interval(function() {
               //$scope.player = $player;
            }, 500);
        }
    ]);
})();