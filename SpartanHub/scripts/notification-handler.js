function showNotification(text, callback) {
    $("#notification-area").append("<section class=\"notification\"><p class=\"notification-message\">"+ text +"</p></section>");
    $("#notification-area").fadeIn(500);
    $(".notification").click(function() { callback() });
}

function removeNotification() {
    $("#notification-area").fadeOut(250);
}

function removeNotificationImmediate() {
    $("#notification-area").fadeOut(0);
}
