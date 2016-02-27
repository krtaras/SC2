;var SCPlayer = null;
;var apiHelper = null;
;var PlayerService = (function(SC){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html'
    }
    var isMinimized = false;
    var isTabsOpened = false;
    
    function PlayerService() {
        apiHelper = new APIHelper();
        SCPlayer = new Player();
        this.view  = {
            isMinimized: false,
            isTabsOpened: false,
            viewURL: '/extension/app/view/player-max.html',
            tabsURL: ''
        };
        updateState.call(this);
    };
    
    PlayerService.prototype.minimize = function() {
        this.view.isMinimized = true;
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    PlayerService.prototype.maximize = function() {
        this.view.isMinimized = false;
        updateState.call(this);
    }
    PlayerService.prototype.openTabs = function() {
        this.view.isTabsOpened = true;
        updateState.call(this);
    }
    PlayerService.prototype.closeTabs = function() {
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    
    function updateState() {
        var ps = this;
        ps.view.viewURL = ps.view.isMinimized ? htmlUrls.min : htmlUrls.max;
        ps.view.tabsURL = ps.view.isTabsOpened ? htmlUrls.tabs : "" ;
    }
    return PlayerService;
})(SC);