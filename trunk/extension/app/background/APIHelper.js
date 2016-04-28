//@ sourceURL=APIHelper.js
; var APIHelper = (function(SC) {

    var client_id = 'c0e833fecbe9557b9ba8e676b4786b3a';
    var connectionURL = 'https://soundcloud.com/connect?client_id=c0e833fecbe9557b9ba8e676b4786b3a&redirect_uri=http%3a%2f%2fkrtaras.github.io%2fsound-cloud%2fcallback.html&response_type=token&scope=non-expiring';
    var access_token = '';
    
    
    var isGuest = false;
    var isLoginned = false;
    var scUser = false;
    
    SC.initialize({
        client_id: 'c0e833fecbe9557b9ba8e676b4786b3a',
    });

    function APIHelper() {
        this.currentUser = {
            isGuest: false,
            isLoginned: false,
            scUser: false
        };
    }
    
    APIHelper.prototype.loginAsGuest = function() {
        var api = this;
        isGuest = true;
        isLoginned = true;
        api.currentUser.isLoginned = isLoginned;
        api.currentUser.isGuest = isGuest;
    }
    
    APIHelper.prototype.connect = function() {
        var api = this;
        chrome.tabs.create({ url: connectionURL, selected: true }, function(tab) {
            var authTabId = tab.id;
            chrome.tabs.onUpdated.addListener(function tabUpdateListener(tabId, changeInfo) {
                if (tabId == authTabId && changeInfo.url != undefined && changeInfo.status == "loading") {
                    if (changeInfo.url.indexOf('access_token') > -1) {
                        access_token = getParam('#access_token', changeInfo.url);
                        if (access_token != null && access_token != '') {
                              SC.initialize({
                                    client_id: 'c0e833fecbe9557b9ba8e676b4786b3a',
                                    oauth_token: access_token
                              });
                              isLoginned = true;
                              scUser = true;
                              isGuest = false;
                        }
                        api.currentUser.isLoginned = isLoginned;
                        api.currentUser.isGuest = isGuest;
                        api.currentUser.scUser = scUser;
                        chrome.tabs.remove(tabId, function() { });
                    }
                }
            });
        });
    }

    function getParam(param, url) {
        var vars = {};

        url.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function(m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }

    APIHelper.prototype.searchSounds = function(searchStr, callback) {
        return callAPI('/tracks', { q: searchStr, limit: 200 }, function(data) {
           return callback(data);
        });
    }

    APIHelper.prototype.getMyActivities = function(callback) {
        return callAPI('/me/activities', {oauth_token:access_token, limit:200}, function(data) {
           return callback(data.collection);
        });
    }

    APIHelper.prototype.getCharts = function(callback) {
        return $.getJSON('https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aall-music&client_id=' + client_id + '&limit=200', {
        }, function(data) {
           return callback(data.collection);
        });
    }

    APIHelper.prototype.getSoundsFromPlayList = function(playlist, callback) {
        return callAPI('/playlists/' + playlist.id + '/tracks', {oauth_token:access_token}, function(data) {
           return callback(playlist, data); 
        });
    }

    APIHelper.prototype.getMyPlaylists = function(callback) {

    }

    APIHelper.prototype.getCompleteURL = function(url) {
        return url + '/stream?client_id=' + client_id;
    }

    APIHelper.prototype.getTrackURL = function(trackId) {
        return 'https://api.soundcloud.com/tracks/' + trackId + '/stream?client_id=' + client_id;
    }

    function callAPI(str, params, callback) {
       return SC.get(str, params).then(callback);
    }

    return APIHelper;
})(SC);