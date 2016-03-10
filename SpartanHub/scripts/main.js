$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    appendLine(format("logged in as {0}", gamertag));
    loadProfile();
}

function appendLine(line) {
    $("body").append(line + "<br>");
}
