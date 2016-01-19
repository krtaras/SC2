;var BackGroundController = (function() {
	
    function BackGroundController() {
        this.currentUser = new CurrentUser();
        this.playerState = new PlayerState();
    }
	
    return BackGroundController;
})();

var BackGround = new BackGroundController();

