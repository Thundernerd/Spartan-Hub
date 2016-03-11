function format() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function toPascalCase(value) {
    return value.replace(/(\w)(\w*)/g,
        function(g0,g1,g2){
            return g1.toUpperCase() + g2.toLowerCase();
        });
}

function appendLine(line) {
    $("body").append(line + "<br>");
}
