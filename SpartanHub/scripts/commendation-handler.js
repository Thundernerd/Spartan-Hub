var enemyUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/commendations/fdbb1dd7-22bf-4924-babb-75700d91c3ec/players/{0}";
var weaponUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/commendations/a37b7045-20af-4353-9f42-5a424baee6e4/players/{0}";
var vehicleUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/commendations/7914afcb-8735-40cc-af08-29e0f19a1bd4/players/{0}";
var gameModeUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/commendations/8dca5109-6f65-4c78-a7b4-6badcd53dc5b/players/{0}";
var multiplayerUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/commendations/647a5a80-dfea-401f-84ba-77d1152c4b39/players/{0}";

var commendations = { }

function loadCommendations() {
    var enemyDone = false, weaponDone = false, vehicleDone = false,
        gameModeDone = false, multiplayerDone = false;

    downloadCommendations(format(enemyUrl, gamertag), function() {
        enemyDone = true;
        checkCommendations(enemyDone,weaponDone,vehicleDone,gameModeDone,multiplayerDone);
    });
    downloadCommendations(format(weaponUrl, gamertag), function() {
        weaponDone = true;
        checkCommendations(enemyDone,weaponDone,vehicleDone,gameModeDone,multiplayerDone);
    });
    downloadCommendations(format(vehicleUrl, gamertag), function() {
        vehicleDone = true;
        checkCommendations(enemyDone,weaponDone,vehicleDone,gameModeDone,multiplayerDone);
    });
    downloadCommendations(format(gameModeUrl, gamertag), function() {
        gameModeDone = true;
        checkCommendations(enemyDone,weaponDone,vehicleDone,gameModeDone,multiplayerDone);
    });
    downloadCommendations(format(multiplayerUrl, gamertag), function() {
        multiplayerDone = true;
        checkCommendations(enemyDone,weaponDone,vehicleDone,gameModeDone,multiplayerDone);
    });
}

function checkCommendations(one,two,three,four,five) {
    if (one && two && three && four && five) {
        onCommendationsLoaded();
    }
}

function downloadCommendations(url, callback) {
    $.get(url, function(data) {
        var html = $(data);
        var comms = getCommendations(html);
        setCommendations(comms);

        callback();
    });
}

function getCommendations(html) {
    var commendations = [];

    var category = toPascalCase($(html).find(".commendations h2").text()).trim();
    var comms = $(html).find(".commendation");

    for (var i = 0; i < comms.length; i++) {
        var c = $(comms[i]);

        var commendation = {
            "category": category.replace("Commendations", "").trim(),
            "imageUrl": $(c.find("img")[0]).attr("src").trim(),
            "title": $(c.find(".text--large")[0]).text().trim(),
            "level": $(c.find(".text--smallest")[0]).text().substr(6).trim(),
            "description": $(c.find(".description")[0]).text().trim(),
            "percentage": $(c.find(".progress-chart")[0]).attr("data-value"),
            "progress": $(c.find(".xp")[0]).text().trim(),
            "reward": $(c.find(".reward")[0]).text().trim()
        }

        commendations.push(commendation);
    }

    return commendations;
}

function setCommendations(comms) {
    for (var i = 0; i < comms.length; i++) {
        var comm = comms[i];
        var category = comm.category;
        if (commendations[category] == undefined) {
            commendations[category] = [];
        }
        commendations[category].push(comm);
    }
}
