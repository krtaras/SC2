;var PlayerState = (function(){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html'
    }
    var isMinimized = false;
    var isTabsOpened = false;
    var volume = 0;
    
    function PlayerState() {
        this.state = [];
        updateState.call(this);
    };
    
    PlayerState.prototype.minimize = function() {
        isMinimized = true;
        isTabsOpened = false;
        updateState.call(this);
    }
    PlayerState.prototype.maximize = function() {
        isMinimized = false;
        updateState.call(this);
    }
    PlayerState.prototype.openTabs = function() {
        isTabsOpened = true;
        updateState.call(this);
    }
    PlayerState.prototype.closeTabs = function() {
        isTabsOpened = false;
        updateState.call(this);
    }
    PlayerState.prototype.setVolume = function(value) {
        volume = value;
        updateState.call(this);
    }
    
    function updateState() {
        var ps = this;
        var viewURL = isMinimized ? htmlUrls.min : htmlUrls.max;
        var tabsURL = isTabsOpened ? htmlUrls.tabs : "" ;
        var playerState = {
            isMinimized:isMinimized,
            isTabsOpened:isTabsOpened,
            viewURL:viewURL,
            tabsURL:tabsURL,
            volume:volume
        }
        ps.state = playerState;
    }
    
    return PlayerState;
})();