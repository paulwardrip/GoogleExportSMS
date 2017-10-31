var Dots;

$(document).ready(function () {

    var interval;

    var styles = ".dots {text-align: left;" +
        "position: absolute;" +
        "height: 240px;" +
        "width: 300px;" +
        "font-family: sans-serif;" +
        "font-size: 200px;" +
        "color: white;" +
        "background-color: black;" +
        "border-radius: 20px;" +
        "display: none" +
        "}" +
        ".dots .inner {" +
        "position: absolute;" +
        "left: 70px;" +
        "}" +
        ".dot1{" +
        "animation: blinker 1.5s linear infinite;" +
        "}" +
        ".dot2{" +
        "animation: blinker 1.5s linear infinite;" +
        "animation-delay: .5s" +
        "}" +
        ".dot3{" +
        "animation: blinker 1.5s linear infinite;" +
        "animation-delay: 1s" +
        "}" +
        "@keyframes blinker {  " +
        "50% { opacity: 0; }" +
        "}";


    $("head").append("<style type='text/css'>" + styles + "</style>");

    var $elem = $("<div class='dots'>" +
        "<span class='inner'>" +
        "<span class='dot1'>.</span>" +
        "<span class='dot2'>.</span>" +
        "<span class='dot3'>.</span>" +
        "</span>" +
        "</div>");
    var $inner = $elem.find(".inner");

    $("body").append($elem);

    new AutoLightBox($elem);

    Dots = {
        show: function () {
            $elem.show();
            $elem.centerize();
        },
        hide: function () {
            clearInterval(interval);
            $elem.hide();
        }
    }
});