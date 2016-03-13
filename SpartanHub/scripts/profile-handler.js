var profile = {
    name: "",
    tag: "",
    imageUrl: "",

    rank: "",
    currentXp: 0,
    maximumXp: 0,
    levelPercentage: 0,

    arenaTime: 0,
    arenaWins: 0,
    arenaLosses: 0,
    arenaWinLossRatio: 0,

    warzoneTime: 0,
    warzoneWins: 0,
    warzoneLosses: 0,
    warzoneWinLossRatio: 0,

    totalTime: 0,
    totalWins: 0,
    totalLosses: 0,
    totalWinLossRatio: 0,

    playlists: []
}

function loadProfile() {
    profile.name = gamertag;

    var genericDone = false;
    var playlistsDone = false;

    loadGenericInfo(function() {
        genericDone = true;

        if (genericDone && playlistsDone) {
            onProfileLoaded();
        }
    });

    loadPlaylists(function() {
        playlistsDone = true;

        if (genericDone && playlistsDone) {
            onProfileLoaded();
        }
    });
}

function loadGenericInfo(callback) {
    $.get(format("https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/service-records/players/{0}", gamertag), function(data) {
        var html = $(data);

        var arenaNode = html.find(".region.arena");
        var warzoneNode = html.find(".region.warzone");

        getArenaProfile(arenaNode);
        getWarzoneProfile(warzoneNode);

        profile.totalWins = profile.arenaWins + profile.warzoneWins;
        profile.totalLosses = profile.arenaLosses + profile.warzoneLosses;
        profile.totalWinLossRatio = Math.round(profile.totalWins/profile.totalLosses * 100) / 100;

        var at = getPlaytime(profile.arenaTime);
        var wt = getPlaytime(profile.warzoneTime);
        var temp = format("{0}.{1}:{2}:{3}",
            at.days+wt.days, at.hours+wt.hours, at.minutes+wt.minutes, at.seconds+wt.seconds);
        var tt = getPlaytime(temp);

        profile.arenaTime = at;
        profile.warzoneTime = wt;
        profile.totalTime = tt;

        callback();
    });
}

function loadPlaylists(callback) {
    $.get(format("https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/service-records/arena/players/{0}", gamertag), function(data) {
        html = $(data);

        var playlistNode = html.find(".table.special.detailed");
        var playlists = $(playlistNode[0]).find("div.tr.valign-middle.has-details.show");

        for (var i = playlists.length-1; i >= 0; i--) {
            var pl = $(playlists[i]);
            var nodes = pl.find("div.td.span-2")
            var node = nodes[nodes.length-1];
            var text = parseInt($(node).text().trim().replace("Games Completed:", "").trim());
            if (text < 10) {
                playlists.splice(i,1);
            }
        }

        for (var i = 0; i < playlists.length; i++) {
            var pl = $(playlists[i]);
            var nodes = pl.find("div.td.span-3");
            var title = $(nodes[0]).text().trim();

            var temp = $(nodes[1]).find("div.csr");
            var rank = $(temp[0]).text().trim();
            var img = $($(temp[0]).children()[0]).attr("src");
            var progress = parseInt($($(temp[0]).find(".progress-chart")[0]).attr("data-value"));

            var tp = {
                "title": title,
                "rank": rank,
                "imageUrl": img,
                "progress": progress
            };

            profile.playlists.push(tp);
        }

        callback();
    });
}

function getArenaProfile(node) {
    var temp;
    var nodes = $(node).find(".grid");

    var nameGrid = $(nodes[0]);

    temp = nameGrid.find(".persona.large");
    temp = $(temp[0]).find(".image");
    temp = $(temp[0]).find("img");
    profile.imageUrl = $(temp).attr("src");

    temp = nameGrid.find(".persona.large");
    temp = $(temp[0]).find(".text");
    temp = $(temp[0]).find("p");
    profile.tag = $(temp[0]).text();

    var statsGrid = $(nodes[1]);

    temp = statsGrid.find(".stat.spartan-rank");
    temp = $(temp[0]).find("p");
    profile.rank = $(temp).text();

    temp = $(temp).parent();
    temp = $(temp).find("span");
    temp = $(temp).text();
    temp = temp.replace("XP/","").trim();

    var splits = temp.split("/");
    profile.currentXp = parseInt(splits[0]);
    profile.maximumXp = parseInt(splits[1]);
    profile.levelPercentage = Math.round(profile.currentXp/profile.maximumXp * 100) / 100;

    // temp = statsGrid.find(".col");
    // temp = $(temp[1]).find(".stat");
    // temp = $(temp[0]).find(".value");
    // var kills = parseInt($(temp[1]).text());
    // var deaths = parseInt($(temp[2]).text());
    // var killDeathRatio = kills/deaths;

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[1]).find("p");
    profile.arenaTime = $(temp).text().replace("Playtime","").trim();

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[2]).find("p");
    var games = parseInt($(temp).text().replace("Games Completed","").trim());

    temp = statsGrid.find(".col");
    temp = $(temp[1]).find(".stat");
    temp = $(temp[3]).find("p");
    profile.arenaWins = parseInt($(temp).text().replace("Wins","").trim());
    profile.arenaLosses = games-profile.arenaWins;
    profile.arenaWinLossRatio = Math.round(profile.arenaWins/profile.arenaLosses * 100) / 100;
}

function getWarzoneProfile(node) {
    var temp;
    var nodes = $(node).find(".grid");

    var infoColumn = $(nodes[0]).find(".col")[2];

    temp = $(infoColumn).find(".stat");
    temp = $(temp[0]).find("p");
    profile.warzoneTime = $(temp).text().replace("Playtime","").trim();

    temp = $(infoColumn).find(".stat");
    temp = $(temp[1]).find("p");
    var games = parseInt($(temp).text().replace("Games Completed","").trim());

    temp = $(infoColumn).find(".stat");
    temp = $(temp[2]).find("p");
    profile.warzoneWins = parseInt($(temp).text().replace("Wins","").trim());
    profile.warzoneLosses = games-profile.warzoneWins;
    profile.warzoneWinLossRatio = Math.round(profile.warzoneWins/profile.warzoneLosses * 100) / 100;
}

function getPlaytime(srep) {
    var ind = 0;
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    ind = srep.indexOf('.');
    if (ind != -1) {
        var temp = srep.substring(0,ind);
        days = parseInt(temp);
    }

    srep = srep.substring(ind + 1);
    var splits = srep.split(':');
    if (splits.length == 3) {
        seconds = parseInt(splits[2]);
        minutes = parseInt(splits[1]);
        hours = parseInt(splits[0]);
    } else if (splits.length == 2) {
        seconds = parseInt(splits[2]);
        minutes = parseInt(splits[1]);
    } else if (splits.length == 1) {
        seconds = parseInt(splits[2]);
    }

    return {
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds
    };
}
