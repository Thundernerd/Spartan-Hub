var customizationUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/customization?ownedOnly=false";
var loadoutUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/loadout?ownedOnly=False";
var powerAndVehicleUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/powerandvehicle?ownedOnly=False";
var boostUrl = "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/boost?ownedOnly=False";

function loadRequisitions() {
    loadCustomizationRequisitions();
    loadLoadoutRequisitions();
    loadPowerAndVehicleRequisitions();
    loadBoostRequisitions();
}

function loadCustomizationRequisitions() {
    $.get(customizationUrl, function(data) {
        var html = $(data);
        console.log("customization");
    });
}

function loadLoadoutRequisitions() {
    $.get(loadoutUrl, function(data) {
        var html = $(data);
        console.log("loadout");
    });
}

function loadPowerAndVehicleRequisitions() {
    $.get(powerAndVehicleUrl, function(data) {
        var html = $(data);
        console.log("powerandvehicle");
    });
}

function loadBoostRequisitions() {
    $.get(boostUrl, function(data) {
        var html = $(data);
        console.log("boost");
    });
}
