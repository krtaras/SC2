;var SCPlayer = null;
;var apiHelper = null;
;var PlayerService = (function(){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html',
        homeTab: '/extension/app/view/homeTab.html',
        tracksTab: '/extension/app/view/tracksTab.html',
        playListTab: '/extension/app/view/playListTab.html',
        settingsTab: '/extension/app/view/settingsTab.html'
    }
    
    function PlayerService() {
        apiHelper = new APIHelper();
        SCPlayer = new Player();
        this.view  = {
            isMinimized: false,
            isTabsOpened: false,
            viewURL: htmlUrls.max,
            tabsURL: '',
            activeTabMark: 'home',
            activeTab: htmlUrls.homeTab,
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
    PlayerService.prototype.openHomeTab = function() {
        this.view.activeTab = htmlUrls.homeTab;
        this.view.activeTabMark = 'home';
    }
    PlayerService.prototype.openTracksTab = function() {
        this.view.activeTab = htmlUrls.tracksTab;
        this.view.activeTabMark = 'traks';
    }
    PlayerService.prototype.openPlayListTab = function() {
        this.view.activeTab = htmlUrls.playListTab;
        this.view.activeTabMark = 'playLists';
    }
    PlayerService.prototype.openSettingsTab = function() {
        this.view.activeTab = htmlUrls.settingsTab;
        this.view.activeTabMark = 'settings';
    }
    function updateState() {
        var ps = this;
        ps.view.viewURL = ps.view.isMinimized ? htmlUrls.min : htmlUrls.max;
        ps.view.tabsURL = ps.view.isTabsOpened ? htmlUrls.tabs : "" ;
    }
    return PlayerService;
})();