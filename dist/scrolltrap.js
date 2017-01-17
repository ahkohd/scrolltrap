!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():e.scrolltrap=t()}(this,function(){var e=function(){function e(){}return e.attachScrolltrap=function(e,t){var n=this,o={el:e,token:this.generateToken(),options:t||{}};return this.trappedElements.push(o),e.addEventListener("mouseleave",this.mouseLeave),e.addEventListener("mouseenter",function(e){return n.mouseEnter(o)}),o.token},e.destroyScrolltrap=function(e){var t=this,n=this.trappedElements.filter(function(t){return t.token===e})[0];n&&(this.trappedElements.splice(this.trappedElements.indexOf(n),1),n.el.removeEventListener("mouseleave",this.mouseLeave),n.el.removeEventListener("mouseenter",function(e){return t.mouseEnter}),this.trappedElements.length||document.removeEventListener("wheel",this.trapWheel))},e.mouseEnter=function(t){this.debug&&console.log("mouse entered"),document.addEventListener("wheel",e.trapWheel),this.trapEngagementCheck(t.el),t.options.detectContentChanges&&!function(t){t.addEventListener("DOMNodeRemoved DOMNodeInserted input",e.domChanged)}(t.el)},e.mouseLeave=function(t){this.debug&&console.log("mouse left"),document.removeEventListener("wheel",this.trapWheel),document.removeEventListener("DOMNodeRemoved DOMNodeInserted input",e.domChanged),document.body.classList.remove(e.defaultTrapClassName)},e.domChanged=function(t){e.debug&&console.log(t.type),e.listenerToken&&clearTimeout(e.listenerToken),e.listenerToken=setTimeout(function(){e.refreshTrap(t.target),e.listenerToken=null},100)},e.refreshTrap=function(t){e.trapEngagementCheck(t)},e.trapEngagementCheck=function(t){var n=t.clientHeight,o=t.scrollHeight,r=o-n;e.debug&&(console.log("container height:"+n),console.log("content height:"+o),console.log("scrollable dist: "+r)),o>n?(document.body.classList.add(e.defaultTrapClassName),e.trappedObj={el:t,scrollableDistance:r}):document.body.classList.remove(e.defaultTrapClassName)},e.trapWheel=function(t){if(!document.body.classList.contains(e.defaultTrapClassName))return t.preventDefault(),!1;var n=e.trappedObj.el.scrollTop,o=t.deltaY;return e.debug&&(console.log("delta-y: "+o),console.log("cursor scroll Pos: "+n)),o>0&&(n>=e.trappedObj.scrollableDistance||n+1>=e.trappedObj.scrollableDistance)||o<0&&n<=0?(e.debug&&console.log("trapped"),t.preventDefault(),!1):void 0},e.generateToken=function(){var e=function(e){var t=(Math.random().toString(16)+"000000000").substr(2,8);return e?"-"+t.substr(0,4)+"-"+t.substr(4,4):t};return e()+e(!0)+e(!0)+e()},e}();return e.debug=!1,e.trappedElements=[],e.defaultTrapClassName="trap-scroll-enabled",e});