;var SCHelper = (function() {
	
    var scExtemsionLoadingHtml = 
    '<div class="spinner"> \
        <div class="rect-1"></div> \
        <div class="rect-2"></div> \
        <div class="rect-3"></div> \
        <div class="rect-4"></div> \
        <div class="rect-5"></div> \
        <div class="rect-6"></div> \
        <div class="rect-7"></div> \
        <div class="rect-8"></div> \
    </div>';
    
    function SCHelper() {
        
    }
    
    SCHelper.prototype.drawObjects = function(loadingObj, apiCall) {
         loadingObj.html(scExtemsionLoadingHtml);
         apiCall.then(function() {
            setTimeout(function() {
                loadingObj.html('');
            }, 500);
         });
    }
    
    SCHelper.prototype.buildSoundObject = function(object, inPlaylist, calback) {
        var result = {
            type: 'sound',
            id: object.id,
            inPlaylist: inPlaylist,
            title: object.title,
            art: object.artwork_url,
            duration: object.duration,
            position: 0,
            dynamicURL: false,
            url: APIHelper.getCompleteURL(object.uri),
            playMe: function(calback) {
            }
        }
        return result;
    };
    
    SCHelper.prototype.buildPlayListObject = function(object) {
        return {
            type: 'playlist',
            id: object.id,
            title: object.title,
            art: object.artwork_url,
            index: 0,
            sounds: []
        }
    }
    
    SCHelper.prototype.scrollToSound = function(listObj, soundId, inPlaylist, playlistId) {
        var topOffset = 0;
        if (inPlaylist) {
            if (listObj.find('#playlist-'+playlistId).find('#pl-sound-'+soundId).length > 0) {
                topOffset = listObj.find('#playlist-'+playlistId).find('#pl-sound-'+soundId).offset().top;
            }
        } else {
            if (listObj.find('#sound-'+soundId).length > 0) {
                topOffset = listObj.find('#sound-'+soundId).offset().top;
            }
        }
        var scrollTop = listObj.scrollTop() + topOffset - listObj.offset().top - 10;
        listObj.animate({ scrollTop: scrollTop+"px"});
    };
    
    return SCHelper;
})();

var SCHelper = new SCHelper();