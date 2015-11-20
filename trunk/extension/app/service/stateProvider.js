;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var providerName = '$state';
    app.provider(providerName, function() {
            var viewState = {
                isMinimized: false,
                isTabsOpened: false,
                playerHtmlPath: '',
                tabsHtmlPath: ''
            };
            
            var soundState = {
                soundName: '',
                soundImg: '',
                volume: 0,
                position: 0
            }
            
            return {
                setViewState: function(state) {
                    viewState = state;
                },
                
                setSoundState: function(state) {
                    soundState = state;
                },
                
                $get: function() {
                    function changePlayerMode() {
                       viewState.playerHtmlPath = viewState.isMinimized ? "/extension/app/view/player-max.html" : "/extension/app/view/player-min.html";
                       viewState.isMinimized = !viewState.isMinimized;
                    }
                    
                    function togleTabs() {
                       viewState.tabsHtmlPath = viewState.isTabsOpened ? "" : "/extension/app/view/tabs.html";
                       viewState.isTabsOpened = !viewState.isTabsOpened;
                    }
                    
                    function updateSoundName(name) {
                        soundState.soundName = name;
                    }
                    
                    function updateVolume(level) {
                        soundState.volume = level;
                    }
                    
                    function updatePosition(position) {
                        soundState.position = position;
                    }
                    
                    function test() {
                        console.log('test');
                    }
                    
                    return {
                        params: viewState,
                        sound: soundState,
                        changePlayerMode: changePlayerMode,
                        togleTabs: togleTabs,
                        updatePosition: updatePosition
                    };
                }
            }
        }
    );
    app.config(function($stateProvider) {
        $stateProvider.setViewState({
            isMinimized: false,
            isTabsOpened: false,
            playerHtmlPath: '/extension/app/view/player-max.html',
            tabsHtmlPath: ''
        });
        
        $stateProvider.setSoundState({
            soundName: '',
            soundImg: '',
            volume: 0,
            position: 0
        });
    });
})();