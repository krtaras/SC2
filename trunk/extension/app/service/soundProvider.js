;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var providerName = '$sound';
    app.provider(providerName, function() {
		var soundState = {
			id: -1,
			name: '',
			img: '',
			isPlaying: false,
			isStopped: false,
			position: 0,
		};
				
		return {
			
			setSoundState: function (state) {
				soundState = state;
			},
			
			$get: function() {
				
				function updateAll (state) {
					soundState = state;
				}
				
				function updatePosition (position) {
					soundState.position = position;
				}
				
				function setIsStoped (stoped) {
					soundState.isStopped = stoped;
				}
				
				function setIsPlaying (playing) {
					soundState.isPlaying = playing;
				}
				
				return {
					state: soundState,
					updateAll: updateAll,
					updatePosition: updatePosition,
					setIsStoped: setIsStoped,
					setIsPlaying: setIsPlaying
				};
			}
		}
	});
})();