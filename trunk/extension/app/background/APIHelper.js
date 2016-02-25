;var APIHelper = (function (SC) {
    
    SC.initialize({
		client_id: 'c0e833fecbe9557b9ba8e676b4786b3a'
    });
    
    function APIHelper() {
        
    }
    
    APIHelper.prototype.searchSounds = function(searchStr, callback) {
        
    }
    
    APIHelper.prototype.getMyPlaylists = function(callback) {
        
    }
    
    APIHelper.prototype.getTrackURL = function(trackId, callback) {
        callAPI('/tracks/'+ trackId + '/streams?client_id=c0e833fecbe9557b9ba8e676b4786b3a', {}, function(data) {
            callback(data.http_mp3_128_url);
        });
    }
    
    function callAPI(str, params, callback) {
        SC.get(str).then(callback);
    }
    
    return APIHelper;
})(SC);