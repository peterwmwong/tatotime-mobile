var hideAddressBar, ua;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).bind('touchmove', function(e) {
  return e.preventDefault();
});
hideAddressBar = function() {
  var doScroll, hideIOSAddressBar;
  doScroll = 0;
  setTimeout((hideIOSAddressBar = __bind(function() {
    if (++doScroll === 1) {
      return window.scrollTo(0, 1);
    }
  }, this)), 500);
  return $(window).bind('resize', function() {
    doScroll = 0;
    return hideIOSAddressBar();
  });
};
$('body').attr('class', (ua = navigator.userAgent).match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i) ? window.navigator.standalone ? 'IOSFullScreen' : (hideAddressBar(), 'IOS') : (hideAddressBar(), 'ANDROID'));
define(['./Nav', './Model', './ContextModel', 'cell!./Context', 'cell!./ContextNavBar', 'cell!./TitleBar'], function(Nav, Model, ContextModel, Context, ContextNavBar, TitleBar) {
  var ctxCache;
  ctxCache = {};
  return {
    render: function(_, A) {
      return [_(TitleBar), _('#content'), _(ContextNavBar)];
    },
    afterRender: function() {
      var $content;
      $content = this.$('#content');
      return Nav.bindAndCall({
        'change:current': __bind(function(_arg) {
          var ctxCell, cur, data, isContextSwitch, prev, prevCtxId, _ref;
          cur = _arg.cur, prev = _arg.prev, data = _arg.data;
          isContextSwitch = !data ? true : data != null ? data.isContextSwitch : void 0;
          if (isContextSwitch) {
            if (!(ctxCell = ctxCache[cur.context])) {
              ctxCell = ctxCache[cur.context] = new Context({
                contextid: cur.context,
                initialHash: cur
              });
              $content.append(ctxCell.$el);
            }
            ctxCell.$el.toggle(true);
            if (prevCtxId = prev != null ? prev.context : void 0) {
              if ((_ref = ctxCache[prevCtxId]) != null) {
                _ref.$el.toggle(false);
              }
            }
            if (ctxCell) {
              this.$('#content > .activeTab').removeClass('activeTab');
              ctxCell.$el.toggle(true).toggleClass('activeTab', true);
            } else {
              if (typeof console !== "undefined" && console !== null) {
                if (typeof console.log === "function") {
                  console.log("Could not switch to context = '" + cur.context + "'");
                }
              }
            }
          }
        }, this)
      });
    }
  };
});