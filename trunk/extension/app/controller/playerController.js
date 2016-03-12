;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var controllerName = 'PlayerController';
    var Player = chrome.extension.getBackgroundPage().SCPlayer;
    var BG = chrome.extension.getBackgroundPage().BackGround;
    app.controller(controllerName, ["$interval",
        function PlayerController($interval) {
            var pc = this;
            
            this.state = BG.playerService;
            this.player = Player;
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
            
            this.openHomeTab = function() {
                BG.playerService.openHomeTab();
            }
            this.openTracksTab = function() {
                BG.playerService.openTracksTab();
            }
            this.openPlayListTab = function() {
                BG.playerService.openPlayListTab();
            }
            this.openSettingsTab = function() {
                BG.playerService.openSettingsTab();
            }
            
            this.muteVolume = function() {
                 Player.mute();
                 updateVolumeIcon();
            }
            
            this.updateVolume = function() {
                 Player.setVolume(Player.state.volume);
                 Player.state.isMute = false;
                 updateVolumeIcon();
            };
            
            this.updatePosition = function() {
                Player.setPosition(Player.sound.position);
            }
            
            this.play = function() {
                if (Player.state.onPause) {
                    Player.toggle();
                } else {
                    Player.play();
                }
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
            
            this.toggleRandom = function() {
                Player.toggleRandomPlaying();
            }
            
            function updateVolumeIcon() {
                if (Player.state.isMute) {
                    pc.volumeIcon = "volume_off";
                } else {
                    if (Player.state.volume > 50) {
                         pc.volumeIcon = "volume_up";
                    } else {
                        if (Player.state.volume == 0) {
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
            }, 0);
        }
    ]);
})();