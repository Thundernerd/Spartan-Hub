$(document).ready(function() {
    doLogin(onLoggedIn);
});

function onLoggedIn() {
    loadProfile();
    loadRequisitions();
    loadCommendations();
}

function onProfileLoaded() {
    doProfileUI();
}

function onRequisitionsLoaded() {
    doRequisitionsUI();
}

function onCommendationsLoaded() {
    for(var key in commendations) {
        // appendLine(format("{0}: {1}", key, commendations[key].length));
    }
}
