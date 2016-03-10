$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    appendLine("logged in as " + gamertag);
}

function appendLine(line) {
    $("body").append(line + "<br>");
}
