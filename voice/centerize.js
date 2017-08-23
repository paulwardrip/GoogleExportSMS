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