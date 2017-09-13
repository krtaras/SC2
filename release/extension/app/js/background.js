var _APIHelper=function(a){function b(){this.currentUser={isGuest:!1,isLoginned:!1,scUser:!1},this.tracksSize=200,this.version="1.0.0"}function c(){var a=this,b={access_token:l,isGuest:a.currentUser.isGuest,isLoginned:a.currentUser.isLoginned,scUser:a.currentUser.scUser,version:a.version};chrome.storage.local.set({scAPIAuthorization:b},function(){})}function d(a,b,c){return f("/tracks",{q:b,offset:a.length,limit:e(a)},function(e){return a=i(a,e),a.length<p?d(a,b,c):c(a)})}function e(a){var b=p-a.length;return b<200?b:200}function f(b,c,d){return a.get(b,c).then(d)}function g(b,c,d){return a.put(b,c).then(d)}function h(b,c,d){return a.delete(b,c).then(d)}function i(a,b){for(var c in b)a.push(b[c]);return a}var j="MOu7MScOfOzyf2N6ujt5sYSC55N7gBae",k="https://soundcloud.com/",l="",m=!1,n=!1,o=!1,p=200;return a.initialize({client_id:j}),b.prototype.init=function(){var b=this;chrome.storage.local.get("scAPIAuthorization",function(d){if(d.scAPIAuthorization){var e=d.scAPIAuthorization;if(!e.version||e.version!=b.version)return b.currentUser.isLoginned=!1,b.currentUser.isGuest=!1,b.currentUser.scUser=!1,void c.call(b);l=e.access_token,n=e.isLoginned,""==l?n?(m=!0,o=!1):(m=!1,o=!1):(a.initialize({client_id:j,oauth_token:l}),m=e.isGuest,o=e.scUser),b.currentUser.isLoginned=n,b.currentUser.isGuest=m,b.currentUser.scUser=o}else c.call(b)})},b.prototype.clearStorage=function(){chrome.storage.local.remove("scAPIAuthorization",function(a){})},b.prototype.setTrackSize=function(a){a>=10&&(p=a,this.tracksSize=a)},b.prototype.loginAsGuest=function(){var a=this;m=!0,n=!0,a.currentUser.isLoginned=n,a.currentUser.isGuest=m,c.call(a)},b.prototype.connect=function(){var b=this;chrome.tabs.create({url:k,selected:!0},function(d){var e=d.id;chrome.runtime.onMessage.addListener(function(d,f,g){if("setAuthData"===d.text){var h=d.token;void 0!=h&&(null!=h&&""!=h&&(a.initialize({client_id:j,oauth_token:h}),l=h,n=!0,o=!0,m=!1),b.currentUser.isLoginned=n,b.currentUser.isGuest=m,b.currentUser.scUser=o,c.call(b)),chrome.tabs.remove(e,function(){})}}),chrome.tabs.onUpdated.addListener(function(a,b){"complete"==b.status&&d.active&&chrome.tabs.sendMessage(d.id,{text:"getAuthData",id:chrome.runtime.id})})})},b.prototype.searchSounds=function(a,b){var c=[];return d(c,a,b)},b.prototype.searchSoundsOld=function(a,b){return f("/tracks",{q:a,limit:p},function(a){return b(a)})},b.prototype.getMyActivities=function(a){return f("/me/activities",{oauth_token:l,limit:p},function(b){return a(b.collection)})},b.prototype.getCharts=function(a){return $.getJSON("https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aall-music&client_id="+j+"&limit="+p).then(function(b){return a(b.collection)})},b.prototype.getMyTracks=function(a){return f("/me/tracks",{oauth_token:l,limit:p},function(b){return a(b)})},b.prototype.getMyFavorites=function(a){return f("/me/favorites",{oauth_token:l,limit:p},function(b){return a(b)})},b.prototype.getSoundsFromPlayList=function(a,b){return f("/playlists/"+a.id+"/tracks",{oauth_token:l},function(c){return b(a,c)})},b.prototype.getMyPlaylists=function(a){return f("/me/playlists",{oauth_token:l,limit:p},function(b){return a(b)})},b.prototype.getMyFavoritePlaylists=function(a){return f("/e1/me/playlist_likes",{oauth_token:l,limit:p},function(b){return a(b)})},b.prototype.getMyLikedTracksIds=function(a){return f("/e1/me/track_likes/ids",{linked_partitioning:1,oauth_token:l,limit:5e3},function(b){return a(b.collection)})},b.prototype.getMyLikedPlayListsIds=function(a){return f("/e1/me/playlist_likes/ids",{oauth_token:l,limit:5e3},function(b){return a(b)})},b.prototype.doUnLikeTrack=function(a,b){return h("/me/favorites/"+a,{oauth_token:l},function(a){return b(a)})},b.prototype.doLikeTrack=function(a,b){return g("/me/favorites/"+a,{oauth_token:l},function(a){return b(a)})},b.prototype.doUnLikePlaylist=function(a,b){return h("/e1/me/playlist_likes/"+a,{oauth_token:l},function(a){return b(a)})},b.prototype.doLikePlaylist=function(a,b){return g("/e1/me/playlist_likes/"+a,{oauth_token:l},function(a){return b(a)})},b.prototype.getCompleteURL=function(a){return a+"/stream?client_id="+j},b.prototype.getTrackURL=function(a){return"https://api.soundcloud.com/tracks/"+a+"/stream?client_id="+j},b.prototype.getTrackPermalinkURL=function(a){return f("/tracks/"+a,{client_id:j},function(a){var b=a.permalink_url;b&&b.length>0&&chrome.tabs.create({url:b+"?auto_play=false"})})},b.prototype.getPlayListPermalinkURL=function(a){return f("/playlists/"+a,{client_id:j},function(a){var b=a.permalink_url;b&&b.length>0&&chrome.tabs.create({url:b+"?auto_play=false"})})},b}(SC),_Player=function(){function a(){this.state={volume:50,isMute:!1,isRandom:!1,onPause:!1,loadingSound:!1,isPlaying:!1},this.sound={type:"sound",id:-1,inPlaylist:!1,title:".........",art:"",duration:1e3,position:0,dynamicURL:!1,url:"",playMe:function(){},marked:!1},this.playList={type:"playlist",id:-1,title:".........",art:"",index:0,marked:!1,sounds:[],static:!0},this.customProperty={},this.notifyOnStartingPlayingSound=function(a){},c=[],d=0}soundManager.setup({url:"/app/lib/",flashVersion:9,debugMode:!1,debugFlash:!1,onready:function(){}});var b,c,d;a.prototype.setItems=function(a,b){b&&(c=[]);for(var d in a)c.push(a[d])},a.prototype.playSoundById=function(a){for(var b in c){var f=c[b];if("sound"==f.type&&f.id==a){d=parseInt(b);break}}e.call(this)},a.prototype.playSoundFromPlayListById=function(a,b){var f=!1;for(var g in c){var h=c[g];if("playlist"==h.type){var i=h.sounds;if(h.id==b)for(var j in i)if(i[j].id==a){f=!0,d=parseInt(g),this.playList.id=h.id,this.playList.name=h.name,this.playList.index=parseInt(j),this.playList.sounds=i,this.playList.marked=h.marked,this.playList.static=h.static;break}if(f)break}}e.call(this)},a.prototype.play=function(){e.call(this)},a.prototype.next=function(){j.call(this)},a.prototype.prev=function(){k.call(this)},a.prototype.stop=function(){i.call(this)},a.prototype.toggle=function(){l.call(this)},a.prototype.setPosition=function(a){"undefined"!=typeof b&&b.setPosition(a*b.duration/100)},a.prototype.setVolume=function(a){this.state.volume=a,"undefined"!=typeof b&&b.setVolume(this.state.volume)},a.prototype.toggleRandomPlaying=function(){this.state.isRandom=!this.state.isRandom},a.prototype.mute=function(){this.state.isMute=!this.state.isMute,this.state.isMute?b.setVolume(0):b.setVolume(this.state.volume)},a.prototype.getItemsList=function(){return 1==c.length&&"playlist"==c[0].type?c[0].sounds:c},a.prototype.setLikeForSound=function(a,b){for(var d in c){var e=c[d];if("sound"==e.type&&e.id==a&&(e.marked=b),"playlist"==e.type){var f=e.sounds;for(var g in f)f[g].id==a&&(f[g].marked=b)}}},a.prototype.setLikeForPlaylist=function(a,b){for(var d in c){var e=c[d];"playlist"==e.type&&e.id==a&&(e.marked=b)}};var e=function(){var a=this;i.call(a);var b=f.call(a);null==b&&j.call(a),b.dynamicURL?b.playMe(function(c){b.url=c,g.call(a,b)}):g.call(a,b)},f=function(){var a=this,b=c[d];return"playlist"==b.type?b.sounds.length<1?null:(b.id!=a.playList.id&&(a.playList.id=b.id,a.playList.name=b.name,a.playList.sounds=b.sounds,a.playList.index=0),a.playList.sounds[a.playList.index]):b},g=function(a){var c=this;b=soundManager.createSound({url:a.url,onPlay:function(){c.state.loadingSound=!0},onload:function(d){c.sound.id=a.id,c.sound.title=a.title,c.sound.art=a.art,c.sound.inPlaylist=a.inPlaylist,c.sound.duration=b.duration,c.onPause=!1,c.state.loadingSound=!1,c.state.isPlaying=!0,d||(h.call(c),j.call(c)),c.notifyOnStartingPlayingSound(a)},onfinish:function(){j.call(c)},whileplaying:function(){c.sound.position=100*b.position/b.duration},ondataerror:function(){j.call(c)}});var d=0;c.state.isMute||(d=c.state.volume),b.setVolume(d),b.play()},h=function(){var a=this,b=c[d];if("playlist"==b.type){var e=a.playList.index;b.sounds.splice(e,1),a.playList.sounds.splice(e,1)}else c.splice(d,1)},i=function(){var a=this;"undefined"!=typeof b&&b.destruct(),a.state.isPlaying=!1,a.state.onPause=!1,a.sound.position=0},j=function(){var a=this,b=!0;if("playlist"==c[d].type){var f;if(a.state.isRandom&&a.playList.static)f=n(a.playList.sounds.length);else if(a.state.isRandom){var g=Math.floor(2*Math.random()+1);f=g>1?n(a.playList.sounds.length):a.playList.sounds.length}else f=a.playList.index+1;f>=a.playList.sounds.length&&1==c.length?a.playList.index=0:f<a.playList.sounds.length?(a.playList.index=f,b=!1):d++}else d++;b&&(a.state.isRandom&&(d=m()),d>=c.length&&(d=0)),e.call(a)},k=function(){var a=this,b=!0;if("playlist"==c[d].type){var f=a.playList.index-1;if(a.state.isRandom&&a.playList.static)f=n(a.playList.sounds.length)-1;else if(a.state.isRandom){var g=Math.floor(2*Math.random()+1);f=g>1?n(a.playList.sounds.length):-1}else f=a.playList.index-1;f<0&&1==c.length?a.playList.index=a.playList.sounds.length-1:f>=0?(a.playList.index=f,b=!1):d--}else d--;b&&(a.state.isRandom&&(d=m()),d<0&&(d=c.length-1)),e.call(a)},l=function(){var a=this;"undefined"!=typeof b&&(b.togglePause(),a.state.onPause=b.paused)},m=function(){var a=c.length,b=Math.floor(Math.random()*a+1)-1;return b},n=function(a){var b=a,c=Math.floor(Math.random()*b+1)-1;return c};return a}(),_PlayerHelper=function(){function a(){this.view={isMinimized:!1,isTabsOpened:!1,viewURL:c.max,tabsURL:"",activeTabName:d,activeTab:c.homeTab},this.tabsList={homeTabName:""+d,tracksTabName:""+e,playListsTabName:""+f,settingsTabName:""+g},b.call(this)}function b(){var a=this;a.view.viewURL=a.view.isMinimized?c.min:c.max,a.view.tabsURL=a.view.isTabsOpened?c.tabs:""}var c={max:"/extension/app/view/player-max.html",min:"/extension/app/view/player-min.html",tabs:"/extension/app/view/tabs.html",homeTab:"/extension/app/view/homeTab.html",tracksTab:"/extension/app/view/tracksTab.html",playListTab:"/extension/app/view/playListTab.html",settingsTab:"/extension/app/view/settingsTab.html"},d="home",e="tracks",f="playLists",g="settings";return a.prototype.minimize=function(){this.view.isMinimized=!0,this.view.isTabsOpened=!1,b.call(this)},a.prototype.maximize=function(){this.view.isMinimized=!1,b.call(this)},a.prototype.openTabs=function(){this.view.isTabsOpened=!0,b.call(this)},a.prototype.closeTabs=function(){this.view.isTabsOpened=!1,b.call(this)},a.prototype.openHomeTab=function(){this.view.activeTab=c.homeTab,this.view.activeTabName=d},a.prototype.openTracksTab=function(){this.view.activeTab=c.tracksTab,this.view.activeTabName=e},a.prototype.openPlayListTab=function(){this.view.activeTab=c.playListTab,this.view.activeTabName=f},a.prototype.openSettingsTab=function(){this.view.activeTab=c.settingsTab,this.view.activeTabName=g},a}(),_SCHelper=function(){function a(){}var b='<div class="spinner">         <div class="rect-1"></div>         <div class="rect-2"></div>         <div class="rect-3"></div>         <div class="rect-4"></div>         <div class="rect-5"></div>         <div class="rect-6"></div>         <div class="rect-7"></div>         <div class="rect-8"></div>     </div>';return a.prototype.drawObjects=function(a,c){a.html(b),c.then(function(){setTimeout(function(){a.html("")},500)})},a.prototype.buildSoundObject=function(a,b,c){var d={type:"sound",id:a.id,inPlaylist:b,title:a.title,art:a.artwork_url,duration:a.duration,position:0,dynamicURL:!1,url:APIHelper.getCompleteURL(a.uri),playMe:function(a){},marked:!!a.user_favorite};return d},a.prototype.buildPlayListObject=function(a){return{type:"playlist",id:a.id,title:a.title,art:a.artwork_url,index:0,sounds:[],static:!0}},a.prototype.scrollToSound=function(a,b,c,d){var e=0;c?a.find("#playlist-"+d).find("#pl-sound-"+b).length>0&&(e=a.find("#playlist-"+d).find("#pl-sound-"+b).offset().top):a.find("#sound-"+b).length>0&&(e=a.find("#sound-"+b).offset().top);var f=a.scrollTop()+e-a.offset().top-10;a.animate({scrollTop:f+"px"})},a}(),APIHelper=new _APIHelper;APIHelper.init();var Player=new _Player,PlayerHelper=new _PlayerHelper,SCHelper=new _SCHelper,_Settings=function(){function a(){this.tracksSize=200,this.notification=!1}function b(a){var b=this;a.notification?(b.notification=!0,Player.notifyOnStartingPlayingSound=function(a){var b="https://w.soundcloud.com/icon/assets/images/orange_transparent_64-94fc761.png";a.art&&a.art.length>0&&(b=a.art);var c={type:"basic",title:"SoundCloud Player",message:a.title,iconUrl:b};chrome.notifications.create(c)}):(b.notification=!1,Player.notifyOnStartingPlayingSound=function(a){}),APIHelper.setTrackSize(a.tracksSize),b.tracksSize=APIHelper.tracksSize}var c=200,d=!1;return a.prototype.init=function(){var a=this;chrome.storage.local.get("soundCloudPlayerSettings",function(c){if(c.soundCloudPlayerSettings){var d=c.soundCloudPlayerSettings;b.call(a,d)}else a.save(a.tracksSize,a.notification)})},a.prototype.clearStorage=function(){chrome.storage.local.remove("soundCloudPlayerSettings",function(a){})},a.prototype.save=function(a,c){var d=this,e={tracksSize:a,notification:c};chrome.storage.local.set({soundCloudPlayerSettings:e},function(a){b.call(d,e)})},a.prototype.terminate=function(){APIHelper.clearStorage(),APIHelper=new _APIHelper,APIHelper.init(),Player.stop(),Player=new _Player,PlayerHelper=new _PlayerHelper,SCHelper=new _SCHelper},a.prototype.backToDefault=function(){var a=this;a.clearStorage(),a.save(c,d),a.terminate()},a}(),Settings=new _Settings;Settings.init(),chrome.commands.onCommand.addListener(function(a){switch(console.log("Command:",a),a){case"toggle":Player.toggle();break;case"next":Player.next();break;case"back":Player.prev();break;case"replay":Player.play()}});