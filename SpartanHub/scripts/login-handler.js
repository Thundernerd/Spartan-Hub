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
            $("#notification-area").append("<section class=\"notification\"><p class=\"notification-message\">Click here to log in to Waypoint</p></section>");
            $("#notification-area").fadeIn(500);
            $(".notification").click(function() { showWaypoint() });
        }
    });
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

            $("#notification-area").fadeOut(250);
            setTimeout(function() {
                $("#waiting-area").waitMe({"effect":"pulse", "bg": "rgba(0,0,0,0)"});
            }, 250);
            onLoggedIn();
        }
    });
}
