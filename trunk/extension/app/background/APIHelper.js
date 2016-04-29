//@ sourceURL=APIHelper.js
; var APIHelper = (function (SC) {

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

    APIHelper.prototype.loginAsGuest = function () {
        var api = this;
        isGuest = true;
        isLoginned = true;
        api.currentUser.isLoginned = isLoginned;
        api.currentUser.isGuest = isGuest;
    }

    APIHelper.prototype.connect = function () {
        var api = this;
        chrome.tabs.create({ url: connectionURL, selected: true }, function (tab) {
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
                        chrome.tabs.remove(tabId, function () { });
                    }
                }
            });
        });
    }

    APIHelper.prototype.searchSounds = function (searchStr, callback) {
        return callGetAPI('/tracks', { q: searchStr, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getMyActivities = function (callback) {
        return callGetAPI('/me/activities', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data.collection);
        });
    }

    APIHelper.prototype.getCharts = function (callback) {
        return $.getJSON('https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aall-music&client_id=' + client_id + '&limit=200')
            .then(function (data) {
                return callback(data.collection);
            });
    }

    APIHelper.prototype.getMyTracks = function (callback) {
        return callGetAPI('/me/tracks', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getMyFavorites = function (callback) {
        return callGetAPI('/me/favorites', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getSoundsFromPlayList = function (playlist, callback) {
        return callGetAPI('/playlists/' + playlist.id + '/tracks', { oauth_token: access_token }, function (data) {
            return callback(playlist, data);
        });
    }

    APIHelper.prototype.getMyPlaylists = function (callback) {
        return callGetAPI('/me/playlists', { oauth_token: access_token, limit: 200 }, function (data) {
            return callback(data);
        });
    }
    
    APIHelper.prototype.getMyFavoritePlaylists = function (callback) {
        return callGetAPI('/e1/me/playlist_likes', {oauth_token: access_token, limit: 200,}, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doUnLikeTrack = function (trackId, callback) {
        return callDeleteAPI('/me/favorites/' + trackId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doLikeTrack = function (trackId, callback) {
        return callPutAPI('/me/favorites/' + trackId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doUnLikePlaylist = function (playListId, callback) {
        return callDeleteAPI('/e1/me/playlist_likes/' + playListId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.doLikePlaylist = function (playListId, callback) {
        return callPutAPI('/e1/me/playlist_likes/' + playListId, { oauth_token: access_token }, function (data) {
            return callback(data);
        });
    }

    APIHelper.prototype.getCompleteURL = function (url) {
        return url + '/stream?client_id=' + client_id;
    }

    APIHelper.prototype.getTrackURL = function (trackId) {
        return 'https://api.soundcloud.com/tracks/' + trackId + '/stream?client_id=' + client_id;
    }

    function callGetAPI(str, params, callback) {
        return SC.get(str, params).then(callback);
    }

    function callPutAPI(str, params, callback) {
        return SC.put(str, params).then(callback);
    }

    function callDeleteAPI(str, params, callback) {
        return SC.delete(str, params).then(callback);
    }

    function getParam(param, url) {
        var vars = {};

        url.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi,
            function (m, key, value) {
                vars[key] = value !== undefined ? value : '';
            }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }

    return APIHelper;
})(SC);