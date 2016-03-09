;var APIHelper = (function (SC) {
    
    var connectionURL = 'https://soundcloud.com/connect?client_id=c0e833fecbe9557b9ba8e676b4786b3a&redirect_uri=http%3a%2f%2fkrtaras.github.io%2fsound-cloud%2fcallback.html&response_type=token&scope=non-expiring';
    SC.initialize({
		client_id: 'c0e833fecbe9557b9ba8e676b4786b3a',
        redirect_uri: 'http://127.0.0.1/'
    });
    
    function APIHelper() {
        
    }
    
    APIHelper.prototype.connect = function() {
        SC.connect().then(function() {
            console.log(SC.get('/me'));
        }).then(function(me) {
            console.log('Hello, ' + me.username);
        });
    }
    
    APIHelper.prototype.searchSounds = function(searchStr, callback) {
        callAPI('/tracks', {q:searchStr, limit:200}, function(data) {
            callback(data);
        });
    }
    
    APIHelper.prototype.getMyPlaylists = function(callback) {
        
    }
    
    APIHelper.prototype.getTrackURL = function(trackId, callback) {
       /* callAPI('/tracks/'+ trackId + '/streams?client_id=c0e833fecbe9557b9ba8e676b4786b3a', {}, function(data) {
            callback(data.http_mp3_128_url);
        });*/
        callback('https://api.soundcloud.com/tracks/'+ trackId +'/stream?client_id=c0e833fecbe9557b9ba8e676b4786b3a');
    }
    
    function callAPI(str, params, callback) {
        SC.get(str, params).then(callback);
    }
    
    return APIHelper;
})(SC);