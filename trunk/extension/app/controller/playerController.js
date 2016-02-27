;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$interval",
        function PlayerController($interval) {
            var pc = this;

            this.player = BG.playerService;
            this.volumeIcon = "";
            
            this.changePlayerViewMode = function() {
                if (BG.playerService.view.isMinimized) {
                    BG.playerService.maximize();
                } else {
                    BG.playerService.minimize();
                }
            }
            
            this.toggleTabs = function() {
                if (BG.playerService.view.isTabsOpened) {
                    BG.playerService.closeTabs();
                } else {
                    BG.playerService.openTabs();
                }
            }
            
            this.muteVolume = function() {
                 BG.playerService.toggleMute();
                 updateVolumeIcon();
            }
            
            this.updateVolume = function() {
                 BG.playerService.setVolume(BG.playerService.state.volume);
                 updateVolumeIcon();
            };
            
            this.updatePosition = function() {
                Player.setPosition(Player.sound.position);
            }
            
            this.play = function() {
                Player.play();
            }
            
            this.stop = function() {
                Player.stop();
            }
            
            this.toggle = function() {
                Player.toggle();
            }
            
            this.next = function() {
                Player.next();
            }
            
            this.prev = function() {
                Player.prev();
            }
            
            this.replay = function() {
                Player.play();
            }
            
            function updateVolumeIcon() {
                if (BG.playerService.state.isMute) {
                    pc.volumeIcon = "volume_off";
                } else {
                    if (BG.playerService.state.volume > 50) {
                         pc.volumeIcon = "volume_up";
                    } else {
                        if (BG.playerService.state.volume == 0) {
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