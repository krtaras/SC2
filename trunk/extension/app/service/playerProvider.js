;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var providerName = '$player';
    app.provider(providerName, function() {
			
		var playerState = {
			isMinimazed: false,
			isTabsOpened: false,
			isRandomPlay: false,
			playerHtmlPath: '',
            tabsHtmlPath: '',
			volume: 0
		}
		
		return {
			
			srtPlayerState: function(state) {
				playerState = state;
			},
			
			$get: function() {
				
				function setPlayerState(state) {
					playerState = state;
				}
				
				function setVolume(volume) {
					playerState.volume = volume;
				}
				
				function toggleTabs() {
					playerState.tabsHtmlPath = playerState.isTabsOpened ? "" : "/extension/app/view/tabs.html";
                    playerState.isTabsOpened = !playerState.isTabsOpened;
				}
				
				function changePlayerViewMode() {
					playerState.playerHtmlPath = playerState.isMinimized ? "/extension/app/view/player-max.html" : "/extension/app/view/player-min.html";
                    playerState.isMinimized = !playerState.isMinimized;
				}
				
				return {
					state: playerState,
					updateAll: setPlayerState,
					updateVolume: setVolume,
					toggleTabs: toggleTabs,
					changePlayerViewMode: changePlayerViewMode
				};
			}
		}
	});
})();