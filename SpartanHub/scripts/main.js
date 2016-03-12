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
    doCommendationsUI();
}
