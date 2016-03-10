var gamertag = "";

function doLogin() {
    $.get("https://www.halowaypoint.com/", function(data) {
        var html = $(data);
        var node = html.find("span.gamertag");

        // 2 is logged in; 1 is not
        if (node.length == 2) {
            node = html.find("span.gamertag.case-sensitive");
            gamertag = $(node[0]).text();

            onLoggedIn()
        } else {
            window.addEventListener("focus", onFocusLogin);

            chrome.tabs.create({"url":"https://halowaypoint.com/", "active":true});
        }
    });
}

function onFocusLogin() {
    $.get("https://www.halowaypoint.com/", function(data) {
        var html = $(data);
        var node = html.find("span.gamertag");

        if (node.length == 2) {
            node = html.find("span.gamertag.case-sensitive");
            gamertag = $(node[0]).text();

            window.removeEventListener("focus", onFocusLogin);

            onLoggedIn();
        }
    });
}
