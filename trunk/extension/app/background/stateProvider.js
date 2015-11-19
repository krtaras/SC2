;(function () {
    'use strict';
    var app = angular.module('sound-cloud-player');
    var providerName = '$state';
    app.provider(providerName, function() {
            var viewState = {
                isMinimized: false,
                isTabsOpened: false,
                playerHtmlPath: '',
                tabsHtmlPath: ''
            };
            var test = 'asd';
            
            return {
                setViewState: function(state) {
                    viewState = state;
                },
                
                $get: function() {
                    function changePlayerMode() {
                       viewState.playerHtmlPath = viewState.isMinimized ? "/extension/app/view/player-max.html" : "/extension/app/view/player-min.html";
                       viewState.isMinimized = !viewState.isMinimized;
                       test = 'qwe';
                    }
                    
                    function togleTabs() {
                       viewState.tabsHtmlPath = viewState.isTabsOpened ? "" : "/extension/app/view/tabs.html";
                       viewState.isTabsOpened = !viewState.isTabsOpened;
                    }
                    
                    return {
                        params: viewState,
                        test: test,
                        changePlayerMode: changePlayerMode,
                        togleTabs: togleTabs
                    };
                }
            }
        }
    );
    app.config(function($stateProvider) {
        $stateProvider.setViewState({
            isMinimized: false,
            isTabsOpened: false,
            playerHtmlPath: '/extension/app/view/player-max.html',
            tabsHtmlPath: ''
        });
    });
})();