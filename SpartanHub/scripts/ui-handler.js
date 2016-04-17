function doProfileUI() {
    var text = "";

    text += "<section class=\"profile-wrapper\">";
    text += format("<h2 id=\"gamertag\"><a target=\"_blank\" href=\"{1}\">{0}</a></h2>", profile.name, format("https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/service-records/players/{0}", profile.name));
    text += format("<img src=\"{0}\"></img>", profile.imageUrl);
    text += "</section>";

    append(text, "#header");

    text = "";

    text += format("<span class=\"left\"><h3>{0}</h3></span>", profile.rank);
    text += format("<span class=\"right\"><h3>SR{0}</h3></span>",
        zero(parseInt(profile.rank.replace("SR",""))+1));
    text += format("<span class=\"left\"><h4>{0}</h4></span>", profile.currentXp);
    text += format("<span class=\"right\"><h4>{0}</h4></span>", profile.maximumXp);
    text += "<br style=\"clear:both;\">";
    text += "<div class=\"outer-bar\">";
    text += format("<div class=\"inner-bar\" style=\"width:{0}%\">", profile.levelPercentage * 100);
    text += "&nbsp;</div>";
    text += "</div>";

    append(text, "#level");

    text = "";

    for (var i = 0; i < profile.playlists.length; i++) {
        var pl = profile.playlists[i];

        text += format("<span class=\"left\"><h3>{0}</h3></span>", pl.title);
        text += format("<span class=\"right\"><h3>{0}</h3></span>", pl.title);

        if (pl.rank == "Onyx" || pl.rank == "Champion") {
            var isOnyx = pl.rank == "Onyx";

            text += format("<span class=\"left\"><h4>{0} {1}</h4></span>", pl.rank, pl.progress);
            text += format("<span class=\"right\"><h4>{0} {1}</h4></span>", pl.rank, isOnyx ? 2500 : 1);

            text += "<br style=\"clear:both;\">";
            text += "<div class=\"outer-bar\">";
            text += format("<div class=\"inner-bar\" style=\"width:{0}%\">",
                        (isOnyx ? pl.progress / 2500 : 1 - (pl.progress / 250)) * 100);
        } else {
            text += format("<span class=\"left\"><h4>{0}</h4></span>", pl.rank);

            var t = parseInt(pl.rank.substr(pl.rank.length-2).trim()) + 1;
            if (t == 7) {
                text += format("<span class=\"right\"><h4>RANK UP</h4></span>");
            } else {
                text += format("<span class=\"right\"><h4>{0} {1}</h4></span>",
                    pl.rank.substring(0, pl.rank.length-2).trim(), parseInt(pl.rank.substr(pl.rank.length-2).trim()) +1);
            }

            text += "<br style=\"clear:both;\">";
            text += "<div class=\"outer-bar\">";
            text += format("<div class=\"inner-bar\" style=\"width:{0}%\">", pl.progress);
        }

        text += "&nbsp;</div>";
        text += "</div>";
    }

    append(text, "#playlists");
}

function getSeconds(time) {
    var s = 0;

    s += time.days * 86400;
    s += time.hours * 3600;
    s += time.minutes * 60;
    s += time.seconds;

    return s;
}

function doCommendationsUI() {
    var all = [];

    for(var key in commendations) {
        var cat = commendations[key];
        for(var i = 0; i < cat.length; i++) {
            var comm = cat[i];

            if (comm.percentage == 100) continue;
            all.push(comm);
        }
    }

    all.sort(function(a,b) {
        var av = a.percentage;
        var bv = b.percentage;

        if (a.level == "5/5" || a.level == "3/5") {
            av += 100;
        }

        if (b.level == "5/5" || b.level == "3/5") {
            bv += 100;
        }

        return bv-av;
    });

    var text = "";

    for (var i = 0; i < all.length; i++) {
        var comm = all[i];
        var isTop = i % 4 == 0 || i % 4 == 1;

        if (i < 4) {
            text += format("<section class=\"commendation-wrapper {0} {1}\">", i % 2 == 0 ? "left" : "right", isTop ? "top" : "bottom");
        } else {
            text += format("<section class=\"commendation-wrapper {0} {1}\" style=\"display: none;\" >", i % 2 == 0 ? "left" : "right", isTop ? "top" : "bottom");
        }

        text += "<section class=\"commendation-info\">";
        text += format("<img src=\"{0}\"></img>", comm.imageUrl);
        text += "<div>";
        text += format("<h3 class=\"commendation-title\">{0}</h3>",comm.title);
        text += format("<span class=\"commendation-level\">Level {0}</span><br>",comm.level);
        text += format("<span class=\"commendation-description\">{0}</span>",comm.description);
        text += "</div></section>";
        // text += "<br><br>";
        text += "<section class=\"commendation-stats\">";
        text += format("<div class=\"outer-bar\"><div class=\"inner-bar\" style=\"width:{0}%;\">&nbsp;</div></div>", comm.percentage);
        text += format("<span class=\"commendation-reward\">{0}</span>",comm.reward);
        text += format("<span class=\"commendation-progress\">{0}</span>",comm.progress);
        text += "</section>";

        text += "</section>";
    }

    append(text, "#commendations");

    hookCommendationUI();
}

function doRequisitionsUI() {
    simpleRequisitionsUI();
    detailedRequisitionsUI();
}

function simpleRequisitionsUI() {
    var common = { total:0, unlocked:0 }, uncommon = { total: 0, unlocked: 0 }, rare = { total: 0, unlocked: 0 }, ultrarare = { total: 0, unlocked: 0 }, legendary = { total: 0, unlocked: 0 };
    for(var cat in requisitions) {
        for (var scat in requisitions[cat]) {
            var item = requisitions[cat][scat];

            common.unlocked += item.filter(function(obj) { return obj.rarity == "Common" && obj.isOwned == true }).length;
            common.total += item.filter(function(obj) { return obj.rarity == "Common" }).length;

            uncommon.unlocked += item.filter(function(obj) { return obj.rarity == "Uncommon" && obj.isOwned == true }).length;
            uncommon.total += item.filter(function(obj) { return obj.rarity == "Uncommon" }).length;

            rare.unlocked += item.filter(function(obj) { return obj.rarity == "Rare" && obj.isOwned == true }).length;
            rare.total += item.filter(function(obj) { return obj.rarity == "Rare" }).length;

            ultrarare.unlocked += item.filter(function(obj) { return obj.rarity == "Ultra Rare" && obj.isOwned == true }).length;
            ultrarare.total += item.filter(function(obj) { return obj.rarity == "Ultra Rare" }).length;

            legendary.unlocked += item.filter(function(obj) { return obj.rarity == "Legendary" && obj.isOwned == true }).length;
            legendary.total += item.filter(function(obj) { return obj.rarity == "Legendary" }).length
        }
    }

    append("<br>", "#requisitions-overview");
    append("<div id=\"requisitions-simple\">", "#requisitions-overview");
    append(formatSimpleRequisitions("Common", common), "#requisitions-simple");
    append(formatSimpleRequisitions("Uncommon", uncommon), "#requisitions-simple");
    append(formatSimpleRequisitions("Rare", rare), "#requisitions-simple");
    append(formatSimpleRequisitions("Ultra Rare", ultrarare), "#requisitions-simple");
    append(formatSimpleRequisitions("Legendary", legendary), "#requisitions-simple");

    var bronzePacks = common.total - common.unlocked;
    var bronzePrice = bronzePacks * 1250;

    var silverPacks = Math.ceil((uncommon.total - uncommon.unlocked + rare.total - rare.unlocked) / 2);
    var silverPrice = silverPacks * 5000;

    var goldPacks = Math.ceil((ultrarare.total - ultrarare.unlocked + legendary.total - legendary.unlocked) / 2);
    var goldPrice = goldPacks * 10000;

    var text = "";
    text += "<div id=\"requisition-packs\"><table><tr><th class=\"bright bbottom\"><h3>Pack</h3></th><th class=\"bright bbottom bleft\"><h3>Amount to Buy</h3></th><th class=\"bright bbottom bleft\"><h3>REQ points needed</h3></th><th class=\"bbottom bleft\"><h3>Monetary cost</h3></th></tr>";
    text += format("<tr><td class=\"bright btop bbottom\">{0}</td><td class=\"bright btop bbottom bleft\">{1}</td><td class=\"bright btop bbottom bleft\">{2}</td><td class=\"btop bbottom bleft\">${3}</td></tr>", "Bronze", bronzePacks, bronzePrice, 0);
    text += format("<tr><td class=\"bright btop bbottom\">{0}</td><td class=\"bright btop bbottom bleft\">{1}</td><td class=\"bright btop bbottom bleft\">{2}</td><td class=\"btop bbottom bleft\">${3}</td></tr>", "Silver", silverPacks, silverPrice, silverPacks * 2);
    text += format("<tr><td class=\"bright btop bbottom\">{0}</td><td class=\"bright btop bbottom bleft\">{1}</td><td class=\"bright btop bbottom bleft\">{2}</td><td class=\"btop bbottom bleft\">${3}</td></tr>", "Gold", goldPacks, goldPrice, goldPacks * 3);
    text += format("<tr><td class=\"bright btop\">{0}</td><td class=\"bright btop bleft\">{1}</td><td class=\"bright btop bleft\">{2}</td><td class=\"btop bleft\">${3}</td></tr></table></div>",
                "Total", bronzePacks + silverPacks + goldPacks, bronzePrice + silverPrice + goldPrice, (silverPacks * 2) + (goldPacks * 3));

    append(text, "#requisitions-overview");
}

function formatSimpleRequisitions(name, rarity) {
    var text = "";
    text += format("<span class=\"left\"><h3>{0}</h3></span>", name);
    text += format("<span class=\"right\"><h3>{0}</h3></span>", name);
    text += format("<span class=\"left\"><h4>{0}</h4></span>", rarity.unlocked);
    text += format("<span class=\"right\"><h4>{0}</h4></span>", rarity.total);
    text += "<br style=\"clear:both;\">";
    text += "<div class=\"outer-bar\">";
    text += format("<div class=\"inner-bar\" style=\"width:{0}%\">", rarity.unlocked / rarity.total * 100);
    text += "&nbsp;</div>";
    text += "</div>";

    return text;
}

function detailedRequisitionsUI() {
    var left = true;

    for(var cat in requisitions) {
        var text = "";

        text = format("<section class=\"requisition-wrapper {0}\">", left == true ? "left" : "right");
        text += format("<h3 class=\"requisition-header\">{0}</h3>", cat);

        var keyCount = Object.keys(requisitions[cat]).length;
        var i = 0;

        for(var scat in requisitions[cat]) {
            if (i < keyCount -1) {
                text += "<section class=\"requisition-category\">";
            } else {
                text += "<section class=\"requisition-category last\">";
            }

            text += format("<h4 class=\"requisition-category-header\">{0} <img class=\"requisition-arrow\" src=\"images/arrow.png\" /></h4>", scat);

            text += "<div class=\"requisition-category-slider\"><table><tr>"
            text += formatRequisition("Common", requisitions, cat, scat);
            text += formatRequisition("Uncommon", requisitions, cat, scat);
            text += formatRequisition("Rare", requisitions, cat, scat) + "</tr><tr>";
            text += formatRequisition("Ultra Rare", requisitions, cat, scat);
            text += formatRequisition("Legendary", requisitions, cat, scat);
            text += "</tr></table></div></section>";

            i++;
        }

        text += "</section>";

        if (!left) {
            text += "<br style=\"clear: both;\">";
        }

        append(text, "#requisitions");
        text = "";

        left = !left;
    }

    $(".requisition-category-header").click(function(){
        var slider = $($(this).parent().find(".requisition-category-slider")[0]);
        var arrow = $($(this).find(".requisition-arrow")[0]);

        if (slider.prop("slideState") === undefined) {
            slider.prop("slideState", false);
        }

        slider.prop("slideState", !slider.prop("slideState"));
        var newAngle = slider.prop("slideState") ? -90 : 0;

        slider.stop().slideToggle(200);
        arrow.stop().animate( { myProp: newAngle },{
            duration: 200,
            step: function(now, fx) {
                $(this).css("-webkit-transform", format("rotate({0}deg)", now));
            }
        });
    })
}

function formatRequisition(rarity, reqs, cat, scat) {
    return format("<td>{0}: {1}/{2}</td>", rarity, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity && obj.isOwned == true;
    }).length, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity;
    }).length);
}

var commendationDoms;
var commendationIndex = 0;

var fadeSpeed = 150;

function hookCommendationUI() {
    commendationDoms = $(".commendation-wrapper");

    var left = $("#nav-left");
    var right = $("#nav-right");

    left.click(function() {
        fadeCommendations(false);
    });

    right.click(function() {
        fadeCommendations(true);
    });
}

function fadeCommendations(right) {
    var start = commendationIndex;
    var amount = right == true ? 4 : -4;

    if (start == 0 && amount == -4) {
        return;
    } else if (start >= (commendationDoms.length-4) && amount == 4) {
        return;
    }

    for(var i = start; i < start + 4; i++) {
        $(commendationDoms[i]).fadeOut(fadeSpeed);
    }

    start += amount;
    commendationIndex += amount;

    for(var i = start; i < start + 4; i++) {
        $(commendationDoms[i]).delay(fadeSpeed).fadeIn(fadeSpeed);
    }
}
