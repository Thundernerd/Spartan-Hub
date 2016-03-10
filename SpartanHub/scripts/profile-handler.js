function loadProfile() {
    var url = format("https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/service-records/players/{0}", gamertag);

    $.get(url, function(data) {
        var html = $(data);

        var arenaNode = html.find(".region.arena");
        var warzoneNode = html.find(".region.warzone");

        getArenaProfile(arenaNode);
        getWarzoneProfile(warzoneNode);
    });
}

function getArenaProfile(node) {
    
}

function getWarzoneProfile(node) {

}
