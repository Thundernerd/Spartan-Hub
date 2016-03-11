var customizationUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/customization?ownedOnly=false";
var loadoutUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/loadout?ownedOnly=False";
var powerAndVehicleUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/powerandvehicle?ownedOnly=False";
var boostUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/boost?ownedOnly=False";

var requisitions = { }

function loadRequisitions() {
    var customizationDone = false;
    var loadoutDone = false;
    var powerAndVehicleDone = false;
    var boostDone = false;

    downloadRequisitions(customizationUrl, function() {
        customizationDone = true;
        checkRequisitions(customizationDone,loadoutDone,powerAndVehicleDone,boostDone);
    });
    downloadRequisitions(loadoutUrl, function() {
        loadoutDone = true;
        checkRequisitions(customizationDone,loadoutDone,powerAndVehicleDone,boostDone);
    });
    downloadRequisitions(powerAndVehicleUrl, function() {
        powerAndVehicleDone = true;
        checkRequisitions(customizationDone,loadoutDone,powerAndVehicleDone,boostDone);
    });
    downloadRequisitions(boostUrl, function() {
        boostDone = true;
        checkRequisitions(customizationDone,loadoutDone,powerAndVehicleDone,boostDone);
    });
}

function checkRequisitions(one,two,three,four) {
    if (one && two && three && four) {
        onRequisitionsLoaded();
    }
}

function downloadRequisitions(url, callback) {
    $.get(url, function(data) {
        var html = $(data);
        var regions = getRegions(data);
        var reqs = getRequisitions(regions);
        setRequisitions(reqs);

        callback();
    });
}

function getRegions(html) {
    var regions = [];

    var temp = $(html).find("div.region");
    for (var i = 0; i < temp.length; i++) {
        var attr = $(temp[i]).attr("class");
        if (attr == "region") {
            regions.push(temp[i]);
        }
    }

    return regions;
}

function getRequisitions(region) {
    var reqs = [];

    for (var i = 0; i < region.length; i++) {
        var r = $(region[i]);
        var temp = r.find("h2.category-name");

        var category = $(temp).text();
        var ind = category.indexOf('(');
        category = category.substring(0, ind).trim();

        var cards = r.find("div.card");
        for (var j = 0; j < cards.length; j++) {
            var btn = $($(cards[j]).find("button")[0]);
            var img = $(cards[j]).find("img");

            var card = {
                "category": category,
                "id": btn.attr("data-id").trim(),
                "name": btn.attr("data-name").trim(),
                "description": btn.attr("data-description").trim(),
                "price": parseInt(btn.attr("data-sell-price").trim()),
                "isWearable": btn.attr("data-is-wearable").trim() == "True",
                "isOwned": btn.attr("data-have-owned").trim() == "True",
                "subCategory": btn.attr("data-subcategory").trim(),
                "wearableId": parseInt(btn.attr("data-wearable-id").trim()),
                "isDurable": btn.attr("data-is-durable").trim() == "True",
                "hasCertification": btn.attr("data-is-durable").trim() == "True",
                "rarity": btn.attr("data-rarity").trim(),
                "rarityType": parseInt(btn.attr("data-rarity-type").trim()),
                "energyLevel": parseInt(btn.attr("data-energy-level").trim()),
                "imageUrl": $(img).attr("data-src").trim()
            };

            reqs.push(card);
        }
    }

    return reqs;
}

function setRequisitions(reqs) {
    for (var i = 0; i < reqs.length; i++) {
        var req = reqs[i];
        var category = toPascalCase(req.category);
        if (requisitions[category] == undefined) {
            requisitions[category] = [];
        }
        requisitions[category].push(req);
    }
}
