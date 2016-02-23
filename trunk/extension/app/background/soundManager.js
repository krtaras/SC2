;var SCPlayer = null;
;var SoundManager = (function (SC) {
   
   SC.initialize({
		client_id: 'c0e833fecbe9557b9ba8e676b4786b3a'
   });
   
   function SoundManager() {
   };
   
   SoundManager.prototype.play = function() {
       playTrack();
   }
   
   SoundManager.prototype.stop = function() {
       if(SCPlayer) {
           SCPlayer = null;
       }
   }
   
   SoundManager.prototype.next = function() {
   }
   
   SoundManager.prototype.prev = function() {
   }
   
   SoundManager.prototype.toggle = function() {
   }
   
   function playTrack() {
       SC.stream('/tracks/246426403').then(initPlayer);
   }
   
   function initPlayer(player) {
       SCPlayer = player;
       SCPlayer.options.debug = true;
       /*SCPlayer.on('time', function() {
			console.log('1');
       });*/
       SCPlayer.play();
   }
   
   return SoundManager;
})(SC);