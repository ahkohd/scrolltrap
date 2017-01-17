;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.scrolltrap = factory();
  }
}(this, function() {
var scrolltrap = (function () {
    function scrolltrap() {
    }
    scrolltrap.attachScrolltrap = function (el, options) {
        var _this = this;
        //Create a trapped element and assign an unique token
        var trapEl = {
            el: el,
            token: this.generateToken(),
            options: options || {}
        };
        this.trappedElements.push(trapEl);
        el.addEventListener("mouseleave", this.mouseLeave);
        el.addEventListener("mouseenter", function (e) { return _this.mouseEnter(trapEl); });
        //Return token for later actions on this el
        return trapEl.token;
    };
    scrolltrap.destroyScrolltrap = function (token) {
        var _this = this;
        //Find elelement we want to destroy and remove it from the array
        var trappedEl = this.trappedElements.filter(function (x) { return x.token === token; })[0];
        if (trappedEl) {
            //remove item from local collection of trapped elements
            this.trappedElements.splice(this.trappedElements.indexOf(trappedEl), 1);
            //De-attach event handlers
            trappedEl.el.removeEventListener("mouseleave", this.mouseLeave);
            trappedEl.el.removeEventListener("mouseenter", function (e) { return _this.mouseEnter; });
            if (!this.trappedElements.length) {
                document.removeEventListener("wheel", this.trapWheel);
            }
        }
    };
    scrolltrap.mouseEnter = function (trappedEl) {
        if (this.debug) {
            console.log("mouse entered");
        }
        //Start listening for scroll events
        document.addEventListener("wheel", scrolltrap.trapWheel);
        this.trapEngagementCheck(trappedEl.el);
        if (trappedEl.options.detectContentChanges) {
            (function (el) {
                //Listen to live mofidications to trapped element
                el.addEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap.domChanged);
            })(trappedEl.el);
        }
    };
    scrolltrap.mouseLeave = function (e) {
        if (this.debug) {
            console.log("mouse left");
        }
        document.removeEventListener("wheel", this.trapWheel);
        document.removeEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap.domChanged);
        document.body.classList.remove(scrolltrap.defaultTrapClassName);
    };
    scrolltrap.domChanged = function (e) {
        if (scrolltrap.debug) {
            console.log(e.type);
        }
        // START Throttler 
        if (scrolltrap.listenerToken) {
            clearTimeout(scrolltrap.listenerToken);
        }
        scrolltrap.listenerToken = setTimeout(function () {
            //Re calculate whether trap should be engaged or nto
            scrolltrap.refreshTrap(e.target);
            scrolltrap.listenerToken = null;
        }, 100);
    };
    scrolltrap.refreshTrap = function (el) {
        scrolltrap.trapEngagementCheck(el);
    };
    scrolltrap.trapEngagementCheck = function (el) {
        var containerHeight = el.clientHeight;
        var contentHeight = el.scrollHeight; // height of scrollable content
        var scrollableDist = contentHeight - containerHeight;
        if (scrolltrap.debug) {
            console.log("container height:" + containerHeight);
            console.log("content height:" + contentHeight);
            console.log("scrollable dist: " + scrollableDist);
        }
        // Content is higher than container, scroll bar is VISIBLE
        if (contentHeight > containerHeight) {
            document.body.classList.add(scrolltrap.defaultTrapClassName);
            scrolltrap.trappedObj = {
                el: el,
                scrollableDistance: scrollableDist
            };
        }
        else {
            document.body.classList.remove(scrolltrap.defaultTrapClassName);
        }
    };
    scrolltrap.trapWheel = function (wheelEvent) {
        //Trap not engaged, let the scroll happen
        if (!document.body.classList.contains(scrolltrap.defaultTrapClassName)) {
            wheelEvent.preventDefault();
            return false;
        }
        else {
            var curScrollPos = scrolltrap.trappedObj.el.scrollTop;
            var dY = wheelEvent.deltaY;
            if (scrolltrap.debug) {
                console.log("delta-y: " + dY);
                console.log("cursor scroll Pos: " + curScrollPos);
            }
            // only trap events once we've scrolled to the end or beginning
            //Note that a positive deltaY is a scroll down (and viceversa)
            if ((dY > 0 && (curScrollPos >= scrolltrap.trappedObj.scrollableDistance ||
                curScrollPos + 1 >= scrolltrap.trappedObj.scrollableDistance)) ||
                (dY < 0 && curScrollPos <= 0)) {
                if (scrolltrap.debug) {
                    console.log("trapped");
                }
                wheelEvent.preventDefault();
                return false;
            }
        }
    };
    scrolltrap.generateToken = function () {
        var _p8 = function (s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        };
        return _p8() + _p8(true) + _p8(true) + _p8();
    };
    return scrolltrap;
}());
scrolltrap.debug = false;
scrolltrap.trappedElements = [];
scrolltrap.defaultTrapClassName = "trap-scroll-enabled";

return scrolltrap;
}));
