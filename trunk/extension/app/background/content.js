chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'getAuthData') {
        var token = getCookie("oauth_token");
        if (token != "") {
            //sendResponse.call(this, token);
            chrome.runtime.sendMessage(msg.id, { text: 'setAuthData', token: token });
            console.log(token);
        }
    }
});
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}