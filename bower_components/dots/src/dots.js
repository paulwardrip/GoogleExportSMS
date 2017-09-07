var Dots;

$(document).ready(function () {

    var interval;

    var styles = ".dots {text-align: left;" +
        "position: absolute;" +
        "height: 240px;" +
        "width: 400px;" +
        "font-size: 200px;" +
        "color: white;" +
        "background-color: black;" +
        "border-radius: 20px;" +
        "display: none" +
        "}" +
        ".dots .inner {" +
        "position: absolute;" +
        "left: 150px;" +
        "}";

    $("head").append("<style type='text/css'>" + styles + "</style>");

    var $elem = $("<div class='dots'><span class='inner'>...</span></div>");
    var $inner = $elem.find(".inner");

    $("body").append($elem);

    new AutoLightBox($elem);

    Dots = {
        show: function () {
            $elem.show();
            $elem.centerize();
            interval = setInterval(function () {
                var text = $elem.text();
                if (text == "...") {
                    $inner.text(".");
                } else if (text == "..") {
                    $inner.text("...");
                } else {
                    $inner.text("..");
                }
            },500);
        },
        hide: function () {
            clearInterval(interval);
            $elem.hide();
        }
    }
});