function doProfileUI() {
    appendLine(format("{0} - {1}", profile.name, profile.tag));
    appendLine(format("<img src=\"{0}\"></img>", profile.imageUrl));
    appendLine(format("{0} - {1}/{2} | {3}%", profile.rank, profile.currentXp, profile.maximumXp, profile.levelPercentage * 100));
    appendLine(format("Arena: W:{0} L:{1} R: {2}", profile.arenaWins, profile.arenaLosses, profile.arenaWinLossRatio));
    appendLine(format("Warzone: W:{0} L:{1} R: {2}", profile.warzoneWins, profile.warzoneLosses, profile.warzoneWinLossRatio));
    appendLine(format("Total: W:{0} L:{1} R: {2}", profile.totalWins, profile.totalLosses, profile.totalWinLossRatio));
}

function doRequisitionsUI() {
    var left = true;

    for(var cat in requisitions) {
        var text = "";

        text = format("<section class=\"requisition-wrapper {0}\">", left == true ? "left" : "right");
        text += format("<h2 class=\"requisition-header\">{0}</h2>", cat);

        var keyCount = Object.keys(requisitions[cat]).length;
        var i = 0;

        for(var scat in requisitions[cat]) {
            if (i < keyCount -1) {
                text += "<section class=\"requisition-category\">";
            } else {
                text += "<section class=\"requisition-category-last\">";
            }

            text += format("<h4 class=\"requisition-category-header\">{0}</h4>", scat);

            text += formatRequisition("Common", requisitions, cat, scat) + " ";
            text += formatRequisition("Uncommon", requisitions, cat, scat) + " ";
            text += formatRequisition("Rare", requisitions, cat, scat) + "<br>";
            text += formatRequisition("Ultra Rare", requisitions, cat, scat) + " ";
            text += formatRequisition("Legendary", requisitions, cat, scat);

            text += "</section>";

            i++;
        }
        text += "</section>";

        append(text);

        if (!left) {
            append("<br style=\"clear:both;\">");
            appendLine("");
        }

        left = !left;
    }
}

function formatRequisition(rarity, reqs, cat, scat) {
    return format("{0}: {1}/{2}", rarity, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity && obj.isOwned == true;
    }).length, reqs[cat][scat].filter(function(obj) {
        return obj.rarity == rarity;
    }).length);
}
