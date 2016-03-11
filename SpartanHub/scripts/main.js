$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    appendLine(format("logged in as {0}", gamertag));
    loadProfile();
    loadRequisitions();
}

function onProfileLoaded() {
    appendLine("profile loaded");
}

function onRequisitionsLoaded() {
    appendLine("requisitions loaded");
}
