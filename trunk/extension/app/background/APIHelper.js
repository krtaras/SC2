;var APIHelper = (function (SC) {
    
    SC.initialize({
		client_id: 'c0e833fecbe9557b9ba8e676b4786b3a'
    });
    
    function APIHelper() {
        
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