$(document).ready(function() {
    $("#waiter").waitMe({"effect":"pulse", "bg": "rgba(0,0,0,0)"});
    doLogin(onLoggedIn);
});

var profileLoaded = false;
var requisitionsLoaded = false;
var commendationsLoaded = false;

function checkContent() {
    if (profileLoaded && requisitionsLoaded && commendationsLoaded) {
        $("#content").fadeIn();
        $("#waiter").waitMe("hide");
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
