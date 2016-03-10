( function() {
    var path = chrome.extension.getURL("index.html");

    function appClicked() {
        chrome.tabs.create({
            "url": path
        });
    }

    chrome.browserAction.onClicked.addListener( appClicked );
})();
