;var BackGroundController = (function() {
	
    function BackGroundController() {
        this.currentUser = new CurrentUser();
        this.playerService = new PlayerService();
    }
	
    return BackGroundController;
})();

var BackGround = new BackGroundController();

