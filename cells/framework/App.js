var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['AppDelegate', 'Services', './Model', 'cell!./Tab', 'cell!./TabNavBar', 'cell!./TitleBar', 'cell!pages/watch/Watch'], function(AppDelegate, S, Model, Tab, TabNavBar, TitleBar) {
  var AppModel, curTab, tabCache;
  if (S.isIOS) {
    document.body.addEventListener('touchmove', function(e) {
      return e.preventDefault();
    });
  }
  AppModel = new Model({
    currentTitle: void 0,
    currentHistory: void 0,
    currentTab: void 0
  });
  tabCache = {};
  curTab = null;
  return {
    changeTab: function(tabid) {
      var tab;
      tab = tabCache[tabid];
      if (!tab) {
        tab = tabCache[tabid] = new Tab({
          defaultCellPath: AppModel.tabs[tabid].defaultPagePath,
          model: new Model({
            id: tabid,
            title: 'Loading...'
          })
        });
        tab.model.bind('change:title', __bind(function(newTitle) {
          return AppModel.set('currentTitle', newTitle);
        }, this));
        AppModel.set('currentTitle', tab.model.title);
        this.$content.append(tab.$el);
      }
      AppModel.set('currentTab', tabid);
      AppModel.set('currentHistory', tab.history);
      this.$('#content > .activeTab').removeClass('activeTab');
      return tab.$el.toggleClass('activeTab', true);
    },
    init: function() {
      if (S.isIOSFullScreen) {
        this.options["class"] = 'IOSFullScreenApp';
      }
      AppDelegate.model = AppModel;
      return typeof AppDelegate.init === "function" ? AppDelegate.init() : void 0;
    },
    render: function(_, A) {
      return [
        _(TitleBar, {
          model: AppModel
        }), _('#content'), _(TabNavBar, {
          model: AppModel
        })
      ];
    },
    afterRender: function() {
      var hideIOSAddressBar;
      if (S.isIOS && !S.isIOSFullScreen) {
        setTimeout((hideIOSAddressBar = function() {
          window.scrollTo(0, 1);
          if (window.pageYOffset <= 0) {
            return setTimeout(hideIOSAddressBar, 50);
          }
        }), 100);
        $(window).bind('resize', hideIOSAddressBar);
      }
      this.$content = this.$('#content');
      this.changeTab(AppModel.defaultTab);
      AppModel.bind('goback', function() {
        var _ref;
        return (_ref = tabCache[AppModel.currentTab]) != null ? _ref.history.goBack() : void 0;
      });
      return AppModel.bind('change:currentTab', function(tab) {
        var _ref;
        return AppModel.set('currentHistory', (_ref = tabCache[tab]) != null ? _ref.history : void 0);
      });
    }
  };
});