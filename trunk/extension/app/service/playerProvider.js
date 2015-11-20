;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var providerName = '$bgPlayer';
    app.provider(providerName, function() {
		var soundState = {
			id: -1,
			name: '',
			img: '',
			isPlaying: false,
			isStopped: false,
			position: 0,
		};
		
		var playerState = {
			isMinimazed: false,
			isTabsOpened: false,
			playerHtmlPath: '',
            tabsHtmlPath: ''
		}
		
		return {
			$get: function() {
				
			}
		}
	});
})();