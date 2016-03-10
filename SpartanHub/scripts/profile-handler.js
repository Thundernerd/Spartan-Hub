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
    var temp;
    var nodes = $(node).find(".grid");

    var nameGrid = $(nodes[0]);

    temp = nameGrid.find(".persona.large");
    temp = $(temp[0]).find(".image");
    temp = $(temp[0]).find("img");
    var img = $(temp).attr("src");

    temp = nameGrid.find(".persona.large");
    temp = $(temp[0]).find(".text");
    temp = $(temp[0]).find("p");
    var tag = $(temp[0]).text();

    var statsGrid = $(nodes[1]);

    temp = statsGrid.find(".stat.spartan-rank");
    temp = $(temp[0]).find("p");
    var rank = $(temp).text();

    temp = $(temp).parent();
    temp = $(temp).find("span");
    temp = $(temp).text();
    temp = temp.replace("XP/","").trim();

    var splits = temp.split("/");
    var currentXP = parseInt(splits[0]);
    var maximumXP = parseInt(splits[1]);
    var percentage = currentXP/maximumXP;

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[0]).find(".value");
    var kills = parseInt($(temp[1]).text());
    var deaths = parseInt($(temp[2]).text());
    var killDeathRatio = kills/deaths;

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[1]).find("p");
    var playTime = $(temp).text().replace("Playtime","").trim();

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[2]).find("p");
    var games = parseInt($(temp).text().replace("Games Completed","").trim());

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[3]).find("p");
    var wins = parseInt($(temp).text().replace("Wins","").trim());
    var losses = games-wins;
    var winLossRatio = wins/losses;
}

function getWarzoneProfile(node) {

}
