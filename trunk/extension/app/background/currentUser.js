;var CurrentUser = (function() {
    
    var isGuest = false;
    var isLoginned = false;
    var clientId = "";
    
    function CurrentUser() {
        this.state = [];
        updateState.call(this);
    }
    
    CurrentUser.prototype.loginAsGuest = function() {
        isGuest = true;
        isLoginned = true;
        updateState.call(this);
    }
    
    function updateState() {
        var cu = this;
        var userState = {
            isGuest:isGuest,
            isLoginned:isLoginned
        }
        cu.state = userState;
    }
    
    return CurrentUser;
})();