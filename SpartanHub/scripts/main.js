$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    appendLine(format("logged in as {0}", gamertag));
    loadProfile();
    loadRequisitions();
    loadCommendations();
}

function onProfileLoaded() {
    appendLine("");
    doProfileUI();
}

function onRequisitionsLoaded() {
    appendLine("");
    doRequisitionsUI();
}

function onCommendationsLoaded() {
    appendLine("");
    for(var key in commendations) {
        appendLine(format("{0}: {1}", key, commendations[key].length));
    }
}
