;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$interval",
        function PlayerController($interval) {
            var pc = this;
            
            this.player = BG.playerState;
            this.volumeIcon = "";
            
            this.changePlayerViewMode = function() {
                if (BG.playerState.state.isMinimized) {
                    BG.playerState.maximize();
                } else {
                    BG.playerState.minimize();
                }
            }
            
            this.toggleTabs = function() {
                if (BG.playerState.state.isTabsOpened) {
                    BG.playerState.closeTabs();
                } else {
                    BG.playerState.openTabs();
                }
            }
            
            this.muteVolume = function() {
                 BG.playerState.toggleMute();
                 updateVolumeIcon();
            }
            
            this.updateVolume = function() {
                 BG.playerState.setVolume(BG.playerState.state.volume);
                 updateVolumeIcon();
            };
            
            this.play = function() {
                BG.soundManager.play();
            }
            
            this.stop = function() {
                BG.soundManager.stop();
            }
            
            function updateVolumeIcon() {
                if (BG.playerState.state.isMute) {
                    pc.volumeIcon = "volume_off";
                } else {
                    if (BG.playerState.state.volume > 50) {
                         pc.volumeIcon = "volume_up";
                    } else {
                        if (BG.playerState.state.volume == 0) {
                             pc.volumeIcon = "volume_mute";
                        } else {
                             pc.volumeIcon = "volume_down";
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