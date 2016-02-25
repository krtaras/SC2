;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
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
                BG.playerService.setPosition(BG.playerService.sound.position);
            }
            
            this.play = function() {
                BG.playerService.play();
            }
            
            this.stop = function() {
                BG.playerService.stop();
            }
            
            this.toggle = function() {
                BG.playerService.togglePause();
            }
            
            this.next = function() {
                BG.playerService.next();
            }
            
            this.prev = function() {
                BG.playerService.prev();
            }
            
            this.replay = function() {
                BG.playerService.replay();
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