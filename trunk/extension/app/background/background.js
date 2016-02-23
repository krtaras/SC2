;var BackGroundController = (function() {
	
    function BackGroundController() {
        this.currentUser = new CurrentUser();
        this.playerState = new PlayerState();
        this.soundManager = new SoundManager();
    }
	
    return BackGroundController;
})();

var BackGround = new BackGroundController();

