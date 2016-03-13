( function() {
    var path = chrome.extension.getURL("index.html");

    function appClicked() {
        chrome.windows.getCurrent(function(wind) {
            chrome.tabs.create({
                "windowId": wind.id,
                "url": path
            });
        });
    }

    chrome.browserAction.onClicked.addListener( appClicked );
})();
