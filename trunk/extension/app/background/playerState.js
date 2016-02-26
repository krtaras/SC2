;var PlayerService = (function(SC){
    var htmlUrls = {
        max: '/extension/app/view/player-max.html',
        min: '/extension/app/view/player-min.html',
        tabs: '/extension/app/view/tabs.html'
    }
    var SCPlayer = null;
    var apiHelper = null;
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
        this.state = SCPlayer.state;
        this.sound = SCPlayer.sound;
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
    PlayerService.prototype.setVolume = function(value) {
        SCPlayer.setVolume(value);
        SCPlayer.state.isMute = false;
    }
    PlayerService.prototype.setPosition = function(position) {
        SCPlayer.setPosition(position);
    }
    PlayerService.prototype.toggleMute = function() {
        SCPlayer.mute();
    }
    PlayerService.prototype.play = function() {
        var sounds = [];
        sounds.push({
            id: 65257361,
            title: "Test",
            duration: 1000,
            position: 0,
            dynamicURL: true,
            url: "",
            playMe: function(calback) {
                    apiHelper.getTrackURL(this.id, function(url) {
                        console.log(url);
                        calback(url);
                    });
            }
        });
        SCPlayer.setPlayList(-1, 'test', sounds, true);
        SCPlayer.play();
    }
    PlayerService.prototype.stop = function() {
        SCPlayer.stop();
    }
    PlayerService.prototype.togglePause = function() {
        SCPlayer.toggle();
    }
    PlayerService.prototype.setRandomPlay = function() {
        SCPlayer.setRandomPlaying();
    }
    PlayerService.prototype.next = function() {
        SCPlayer.next();
    }
    PlayerService.prototype.prev = function() {
        SCPlayer.prev();
    }
    PlayerService.prototype.replay = function() {
        SCPlayer.play();
    }
    PlayerService.prototype.getTracks = function(str, callback) {
        apiHelper.searchSounds(str, function(result) {
            console.log(result);
            var sounds = []
            for (var i in result) {
                sounds.push({
                    id: result[i].id,
                    loading: false,
                    title: result[i].title,
                    art: result[i].artwork_url,
                    duration: result[i].duration,
                    position: 0,
                    dynamicURL: true,
                    url: "",
                    playMe: function(calback) {
                        apiHelper.getTrackURL(this.id, function(url) {
                            console.log(url);
                            calback(url);
                        });
                    }
                });
            }
            callback(sounds);
        });
    }
    
    function updateState() {
        var ps = this;
        ps.view.viewURL = ps.view.isMinimized ? htmlUrls.min : htmlUrls.max;
        ps.view.tabsURL = ps.view.isTabsOpened ? htmlUrls.tabs : "" ;
    }
    return PlayerService;
})(SC);