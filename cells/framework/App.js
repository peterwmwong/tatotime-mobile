var hideAddressBar, ua;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
document.body.addEventListener('touchmove', function(e) {
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
define(['AppConfig', './HashManager', './Model', './ContextModel', 'cell!./Context', 'cell!./ContextNavBar', 'cell!./TitleBar'], function(AppConfig, HashManager, Model, ContextModel, Context, ContextNavBar, TitleBar) {
  var ctxCache;
  ctxCache = {};
  return {
    init: function() {
      return window.appmodel = this.AppModel = new Model({
        appConfig: AppConfig,
        currentContext: void 0
      });
    },
    render: function(_, A) {
      return [
        _(TitleBar, {
          model: this.AppModel
        }), _('#content'), _(ContextNavBar, {
          model: this.AppModel
        })
      ];
    },
    afterRender: function() {
      var $content, hashmgr;
      $content = this.$('#content');
      hashmgr = new HashManager({
        appConfig: AppConfig,
        hashDelegate: {
          get: function() {
            return window.location.hash;
          },
          onChange: function(cb) {
            return $(window).bind('hashchange', cb);
          }
        }
      });
      hashmgr.bindAndCall({
        'change:current': __bind(function(_arg) {
          var ctxCell, ctxModel, cur, _ref;
          cur = _arg.cur;
          if (cur.context !== ((_ref = this.AppModel.currentContext) != null ? _ref.id : void 0)) {
            if (!(ctxCell = ctxCache[cur.context])) {
              ctxCell = ctxCache[cur.context] = new Context({
                model: ctxModel = new ContextModel({
                  id: cur.context,
                  defaultPagePath: AppConfig.contexts[cur.context].defaultPagePath,
                  initialHash: cur,
                  hashManager: hashmgr
                })
              });
              $content.append(ctxCell.$el);
            }
            if (ctxCell) {
              this.AppModel.set({
                currentContext: ctxCell.model
              });
              this.$('#content > .activeTab').removeClass('activeTab');
              ctxCell.$el.toggleClass('activeTab', true);
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
      this.AppModel.bind({
        switchContext: __bind(function(ctxid) {
          var pmodel, _ref;
          return window.location.hash = hashmgr.toHash({
            context: ctxid,
            page: (_ref = (pmodel = ctxCache[cur.context].model.currentPageModel)) != null ? _ref.page : void 0,
            data: pmodel != null ? pmodel.data : void 0
          });
        }, this)
      });
      return this.AppModel.bind({
        goback: __bind(function() {
          var hash, _ref, _ref2, _ref3;
          hash = (_ref = this.AppModel.currentContext) != null ? (_ref2 = _ref.pageHistory) != null ? (_ref3 = _ref2[1]) != null ? _ref3.hash : void 0 : void 0 : void 0;
          if (hash != null) {
            return window.location.hash = hash;
          }
        }, this)
      });
    }
  };
});