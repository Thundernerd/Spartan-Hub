var gamertag = "";

function doLogin() {
    $.get("https://www.halowaypoint.com/", function(data) {
        var html = $(data);
        var node = html.find("span.gamertag");

        // 1 is logged in; 0 is not
        if (node.length == 1) {
            node = html.find("span.gamertag.case-sensitive");
            gamertag = $(node[0]).text();

            $("#waiting-area").waitMe({"effect":"pulse", "bg": "rgba(0,0,0,0)"});
            onLoggedIn()
        } else {
            window.addEventListener("focus", onFocusLogin);
            showNotification("Click here to log in to Waypoint", showWaypoint);
        }
    });

    failedLogin = false;
    setTimeout(checkDuration, 7500);
}

var failedLogin = false;

function checkDuration() {
    if (!profileLoaded || !requisitionsLoaded || !commendationsLoaded || !failedLogin) {
        $("#waiting-area").waitMe({"effect":"pulse", "bg": "rgba(0,0,0,0)", "text": "This is taking longer than expected"});
    }
}

function failedLogin() {
    failedLogin = true;
    $("#waiting-area").remove();
    showNotification("It seems something went wrong :( please try again", forceRefresh);
}

function forceRefresh() {
    location.reload(true);
}

function showWaypoint() {
    chrome.tabs.create({url:"https://halowaypoint.com", active: true});
}

function onFocusLogin() {
    $.get("https://www.halowaypoint.com/", function(data) {
        var html = $(data);
        var node = html.find("span.gamertag");

        if (node.length == 1) {
            node = html.find("span.gamertag.case-sensitive");
            gamertag = $(node[0]).text();

            window.removeEventListener("focus", onFocusLogin);

            removeNotification();
            setTimeout(function() {
                $("#waiting-area").waitMe({"effect":"pulse", "bg": "rgba(0,0,0,0)"});
            }, 250);
            onLoggedIn();
        }
    });
}
