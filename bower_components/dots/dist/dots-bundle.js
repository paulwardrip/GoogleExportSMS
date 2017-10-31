
var AutoLightBox = function(elem) {

    var box = document.createElement("div");
    var attached = false;
    var parent;
    var visible = false;
    var control;

    function incrementControl() {
        control = function() {
            if (typeof window.LightboxAutoControl === 'undefined') {
                window.LightboxAutoControl = 1;
            } else {
                window.LightboxAutoControl++;
            }
            return window.LightboxAutoControl;
        }();
    }

    var show = function () {
        if ($) {
            $(box).fadeTo(200, .5);
        } else {
            box.style.opacity = .5;
        }
        if (parent.style.zIndex) {
            box.style.zIndex = parent.style.zIndex - 1;
        } else {
            parent.style.zIndex = 100;
            box.style.zIndex = 99;
        }
        visible = true;
    };

    var hide = function () {
        if ($) {
            $(box).fadeTo(200, 0);
        } else {
            box.style.opacity = 0;
        }
        visible = false;
    };

    function adjustSize() {
        box.style.height = "1px";
        box.style.width = "1px";

        if (visible) {
            box.style.height = window.innerHeight + "px";
            box.style.width = window.innerWidth + "px";
        }
    }

    function assignparent(elem) {
        if (elem) {
            if (elem instanceof jQuery) {
                elem = elem.get(0);
            }

            incrementControl();

            if (parent) {
                parent.classList.remove("lightbox-auto-control-" + (control - 1));
                box.classList.remove("lightbox-" + (control - 1));
            }

            parent = elem;

            if (parent.classList) {
                parent.classList.add("lightbox-auto-control-" + control);
            } else {
                parent.class = "lightbox-auto-control-" + control;
            }

            if (box.classList) {
                box.classList.add("lightbox-" + control);
            } else {
                box.class = "lightbox-" + control;
            }

            var style = window.getComputedStyle(elem);
            var z = style.zIndex;
            if (!z) {
                z = 50;
                elem.style.zIndex = z;
            }

            box.style.zIndex = (parseInt(z) - 1);
        }
    }

    var attach = function () {
        if (!attached) {
            document.body.appendChild(box);
            attached = true;
        }
    };

    var detach = function () {
        document.body.removeChild(box);
        attached = false;
    };

    box.style.position = "fixed";
    box.style.backgroundColor = "black";
    box.style.opacity = 0;
    box.style.left = 0;
    box.style.top = 0;

    assignparent(elem);
    adjustSize();

    attach();

    window.setInterval(function () {
        if (automatic) {
            var ac = document.querySelector(".lightbox-auto-control-" + control);

            if (ac) {
                var style = window.getComputedStyle(ac);
                console.debug(style.display, style.visibility, style.opacity);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0){
                    if (visible) hide();
                } else {
                    if (!visible) show();
                }
            }
        }

        if (attached) {
            adjustSize();
        }
    },100);

    var automatic = true;

    return {
        show: show,
        hide: hide,
        attach: attach,
        detach: detach,
        parent: assignparent,
        color: function (c) {
            box.style.backgroundColor = c;
        },
        automatic: automatic
    }
};
var Centerize = function() {
    function __c(__this, parent) {
        if (!parent) {
            parent = $(window);
        }

        console.log("centerize:", parent.height(), __this.height(), (parent.height() - __this.height()) / 2);
        __this.css({
            top: (parent.outerHeight() - __this.outerHeight()) / 2 + "px",
            left: (parent.outerWidth() - __this.outerWidth()) / 2 + "px"
        });
    }

    $.fn.centerize = function(parent){
        __c(this, parent);
    };

    function __h(useaspect) {
        return function (__this, percent, parent) {
            if (!percent) percent = 1;
            if (percent > 1) percent = percent / 100;

            if (!parent) {
                parent = $(window);
            } else {
                if (typeof parent == "string") {
                    parent = $(parent);
                }
            }

            var aspect;
            var w;
            var h = Math.floor(parent.height() * percent);
            if (useaspect) {
                aspect = __this.width() / __this.height();
                w = Math.floor(h * aspect);
            } else {
                w = __this.width();
            }

            console.log("resized from", __this.width(), "x", __this.height(), "to", w, "x", h, "aspect:", aspect);

            if (__this[0].tagName.toLowerCase() == "canvas") {
                __this[0].height = h;
                __this[0].width = w;
            } else {
                __this.css({
                    height: h + "px",
                    width: w + "px"
                });
            }
        }
    }

    var __ha = __h(true);
    var __ho = __h(false);

    $.fn.heightPercentAspect = function(percent, parent){
        __ha(this, percent, parent);
    };
    $.fn.heightPercent = function(percent, parent){
        __ho(this, percent, parent);
    };

    function __w(useaspect) {
        return function (__this, percent, parent) {
            if (!percent) percent = 1;
            if (percent > 1) percent = percent / 100;

            if (!parent) {
                parent = $(window);
            } else {
                if (typeof parent == "string") {
                    parent = $(parent);
                }
            }

            var aspect;
            var h;
            var w = Math.floor(parent.width() * percent);
            if (useaspect) {
                aspect = __this.height() / __this.width();
                h = Math.floor(w * aspect);
            } else {
                h = __this.height();
            }

            console.log("resized from", __this.width(), "x", __this.height(), "to", w, "x", h, "aspect:", aspect);

            if (__this[0].tagName.toLowerCase() == "canvas") {
                __this[0].height = h;
                __this[0].width = w;
            } else {
                __this.css({
                    height: h + "px",
                    width: w + "px"
                });
            }
        }
    }

    var __wa = __w(true);
    var __wo = __w(false);

    $.fn.widthPercent = function(percent, parent){
        __wo(this, percent, parent);
    };

    $.fn.widthPercentAspect = function(percent, parent){
        __wa(this, percent, parent);
    };

    return {
        centerize: __c,
        heightPercent: __ho,
        heightPercentAspect: __ha,
        widthPercent: __wo,
        widthPercentAspect: __wa
    }
}();
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