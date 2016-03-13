$(document).ready(function() {

    doLogin(onLoggedIn);
});

var profileLoaded = false;
var requisitionsLoaded = false;
var commendationsLoaded = false;

function checkContent() {
    if (profileLoaded && requisitionsLoaded && commendationsLoaded) {
        $("#content").fadeIn();
        $("#waiting-area").remove();
        $("#notification-area").remove();
    }
}

function onLoggedIn() {
    loadProfile();
    loadRequisitions();
    loadCommendations();
}

function onProfileLoaded() {
    doProfileUI();

    profileLoaded = true;
    checkContent();
}

function onRequisitionsLoaded() {
    doRequisitionsUI();

    requisitionsLoaded = true;
    checkContent();
}

function onCommendationsLoaded() {
    doCommendationsUI();

    commendationsLoaded = true;
    checkContent();
}
