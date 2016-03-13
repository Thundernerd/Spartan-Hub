function doProfileUI() {
    var text = "";

    text += "<section class=\"profile-wrapper\">";
    // text += format("<h2>{0}</h2> &nbsp; - {1}", profile.name, profile.tag);
    text += format("<h2>{0}</h2>", profile.name);
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
    text += "<span class=\"left\"><h3>Arena</h3></span>";
    text += "<span class=\"right\"><h3>Warzone</h3></span>";

    text += format("<span class=\"left\"><h4>{0}.{1}:{2}:{3}</h4></span>",
     profile.arenaTime.days, zero(profile.arenaTime.hours),
     zero(profile.arenaTime.minutes), zero(profile.arenaTime.seconds));
     text += format("<span class=\"right\"><h4>{0}.{1}:{2}:{3}</h4></span>",
      profile.warzoneTime.days, zero(profile.warzoneTime.hours),
      zero(profile.warzoneTime.minutes), zero(profile.warzoneTime.seconds));

    text += "<br style=\"clear:both;\">";
    text += "<div class=\"outer-bar warzone\">";

    var totalArena = getSeconds(profile.arenaTime);
    var total = getSeconds(profile.totalTime);

    text += format("<div class=\"inner-bar\" style=\"width:{0}%\">", totalArena / total * 100);
    text += "&nbsp;</div>";
    text += "</div>";

    append(text, "#playtime");

    // appendLine(format("{0} - {1}", profile.name, profile.tag));
    // appendLine(format("<img src=\"{0}\"></img>", profile.imageUrl));
    // appendLine(format("{0} - {1}/{2} | {3}%", profile.rank, profile.currentXp, profile.maximumXp, profile.levelPercentage * 100));
    // appendLine(format("Arena: W:{0} L:{1} R: {2}", profile.arenaWins, profile.arenaLosses, profile.arenaWinLossRatio));
    // appendLine(format("Warzone: W:{0} L:{1} R: {2}", profile.warzoneWins, profile.warzoneLosses, profile.warzoneWinLossRatio));
    // appendLine(format("Total: W:{0} L:{1} R: {2}", profile.totalWins, profile.totalLosses, profile.totalWinLossRatio));
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

            text += format("<h4 class=\"requisition-category-header\">{0}</h4>", scat);

            text += "<table><tr>"
            text += formatRequisition("Common", requisitions, cat, scat);
            text += formatRequisition("Uncommon", requisitions, cat, scat);
            text += formatRequisition("Rare", requisitions, cat, scat) + "</tr><tr>";
            text += formatRequisition("Ultra Rare", requisitions, cat, scat);
            text += formatRequisition("Legendary", requisitions, cat, scat);
            text += "</tr></table></section>";

            i++;
        }

        text += "</section>";
        append(text, "#requisitions");

        left = !left;
    }
}

function formatRequisition(rarity, reqs, cat, scat) {
    return format("<td>{0}: {1}/{2}</td>", rarity, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity && obj.isOwned == true;
    }).length, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity;
    }).length);
}

function hookUiInteraction() {
    $("#nav-left").click(function() {
        var index = getVisibleCommendationIndex();
        console.log(index);
    });

    $("#nav-right").click(function() {
        var index = getVisibleCommendationIndex();
        console.log(index);
    });
}

var commendationDoms;
var commendationIndex = 0;

var hoverLeft = false;
var hoverRight = false;

var fadeSpeed = 125;

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
