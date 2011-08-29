var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', './History', './Model', 'cell!./Tab', 'cell!./TabNavBar', 'cell!pages/watch/Watch'], function(require, S, History, Model, Tab, TabNavBar) {
  var AppModel, curTab, hideIOSAddressBar, tabCache;
  AppModel = new Model({
    currentTab: void 0
  });
  document.body.addEventListener('touchmove', function(e) {
    return e.preventDefault();
  });
  tabCache = {};
  curTab = null;
  hideIOSAddressBar = function() {
    window.scrollTo(0, 1);
    if (window.pageYOffset <= 0) {
      return setTimeout(hideIOSAddressBar, 50);
    }
  };
  return {
    changeTitle: function(newTitle) {
      var rev, title;
      rev = History.wasLastBack && '-reverse' || '';
      if (title = this.$title.html()) {
        this.$prevtitle.html(this.$title.html()).attr('class', 'headingOut' + rev);
      }
      if (newTitle) {
        return this.$title.html(newTitle).attr('class', 'headingIn' + rev);
      } else {
        return this.$title.html('');
      }
    },
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
          return this.changeTitle(newTitle);
        }, this));
        this.$content.append(tab.$el);
      }
      AppModel.set('currentTab', tabid);
      this.$('#content > .activeTab').removeClass('activeTab');
      return tab.$el.toggleClass('activeTab', true);
    },
    init: function() {
      if (S.isIOSFullScreen) {
        return this.options["class"] = 'IOSFullScreenApp';
      }
    },
    render: function(_, A) {
      return require(['AppDelegate'], __bind(function(appDelegate) {
        var _base;
        this.appDelegate = appDelegate;
        this.appDelegate.model = AppModel;
        if (typeof (_base = this.appDelegate).init === "function") {
          _base.init();
        }
        return A([
          _('#header', _('#backbutton', _('span', 'Back')), _('#title', ' '), _('#prevtitle', ' '), _('#forwardbutton', _('span', 'Do It'))), _('#content'), _('#footer', _(TabNavBar, {
            model: AppModel
          }))
        ]);
      }, this));
    },
    afterRender: function() {
      if (S.isIOS && !S.isIOSFullScreen) {
        setTimeout(hideIOSAddressBar, 50);
        $(window).bind('resize', hideIOSAddressBar);
      }
      this.$content = this.$('#content');
      this.$title = this.$('#title');
      this.$title.bind('webkitAnimationEnd', __bind(function() {
        return this.$title.attr('class', '');
      }, this));
      this.$prevtitle = this.$('#prevtitle');
      this.$prevtitle.bind('webkitAnimationEnd', __bind(function() {
        return this.$prevtitle.attr('class', '');
      }, this));
      return this.changeTab(AppModel.defaultTab);
    },
    on: {
      'click #backbutton': function() {
        var _ref;
        return (_ref = tabCache[AppModel.currentTab]) != null ? _ref.history.goBack() : void 0;
      }
    }
  };
});