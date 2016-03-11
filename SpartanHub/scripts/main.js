$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    appendLine(format("logged in as {0}", gamertag));
    loadProfile();
    loadRequisitions();
}

function onProfileLoaded() {
    appendLine(JSON.stringify(profile));
}

function appendLine(line) {
    $("body").append(line + "<br>");
}
