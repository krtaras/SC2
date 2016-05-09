;var _PlayerHelper = (function(){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html',
        homeTab: '/extension/app/view/homeTab.html',
        tracksTab: '/extension/app/view/tracksTab.html',
        playListTab: '/extension/app/view/playListTab.html',
        settingsTab: '/extension/app/view/settingsTab.html'
    }
    
    var homeTabName = "home";
    var tracksTabName = "traks";
    var playListsTabName = "playLists";
    var settingsTabName = "settings";
    
    function _PlayerHelper() {
        this.view  = {
            isMinimized: false,
            isTabsOpened: false,
            viewURL: htmlUrls.max,
            tabsURL: '',
            activeTabName: homeTabName,
            activeTab: htmlUrls.homeTab,
        };
        this.tabsList = {
            homeTabName: "" + homeTabName,
            tracksTabName: "" + tracksTabName,
            playListsTabName: "" + playListsTabName,
            settingsTabName: "" + settingsTabName
        }
        updateState.call(this);
    };
    
    _PlayerHelper.prototype.minimize = function() {
        this.view.isMinimized = true;
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    _PlayerHelper.prototype.maximize = function() {
        this.view.isMinimized = false;
        updateState.call(this);
    }
    _PlayerHelper.prototype.openTabs = function() {
        this.view.isTabsOpened = true;
        updateState.call(this);
    }
    _PlayerHelper.prototype.closeTabs = function() {
        this.view.isTabsOpened = false;
        updateState.call(this);
    }
    _PlayerHelper.prototype.openHomeTab = function() {
        this.view.activeTab = htmlUrls.homeTab;
        this.view.activeTabName = homeTabName;
    }
    _PlayerHelper.prototype.openTracksTab = function() {
        this.view.activeTab = htmlUrls.tracksTab;
        this.view.activeTabName = tracksTabName;
    }
    _PlayerHelper.prototype.openPlayListTab = function() {
        this.view.activeTab = htmlUrls.playListTab;
        this.view.activeTabName = playListsTabName;
    }
    _PlayerHelper.prototype.openSettingsTab = function() {
        this.view.activeTab = htmlUrls.settingsTab;
        this.view.activeTabName = settingsTabName;
    }
    function updateState() {
        var ps = this;
        ps.view.viewURL = ps.view.isMinimized ? htmlUrls.min : htmlUrls.max;
        ps.view.tabsURL = ps.view.isTabsOpened ? htmlUrls.tabs : "" ;
    }
    return _PlayerHelper;
})();