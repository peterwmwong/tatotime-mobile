var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', 'shared/History', 'shared/Model', 'cell!shared/Page', 'cell!pages/watch/Watch'], function(require, S, History, Model, Page) {
  var curPage, hideIOSAddressBar, pageCache;
  pageCache = {};
  curPage = null;
  hideIOSAddressBar = function() {
    window.scrollTo(0, 1);
    if (window.pageYOffset <= 0) {
      return setTimeout(hideIOSAddressBar, 50);
    }
  };
  return {
    changePage: function(page, isReverse) {
      var pageInClass, rev;
      pageInClass = curPage ? (rev = isReverse && '-reverse' || '', curPage.$el.attr('class', 'Page headingOut' + rev), curPage.model.trigger('deactivate'), 'Page headingIn' + rev) : 'Page fadeIn';
      (curPage = page).$el.attr('class', pageInClass);
      curPage.model.trigger('activate');
      return this.$title.html(curPage.model.title || "&nbsp;");
    },
    /*
      Loads and renders the specified Page Cell if not already loaded.
      If already previously loaded, just change to it.
      */
    loadAndChangePage: function(fullpath, pagepath, data) {
      var isReverse, page;
      if (History[0] !== fullpath) {
        isReverse = !(History.addOrRewind(fullpath));
        if ((page = pageCache[pagepath]) != null) {
          page.model.set('data', data);
          this.changePage(page, isReverse);
        } else {
          require(["cell!" + pagepath], __bind(function(pagecell) {
            page = pageCache[pagepath] = new Page({
              cell: pagecell,
              model: new Model({
                pagePath: pagepath,
                data: data
              })
            });
            page.$el.appendTo(this.$content);
            page.model.bind('change:title', __bind(function(title) {
              if (curPage.model.pagePath === pagepath) {
                return this.$title.html(title);
              }
            }, this));
            return this.changePage(page);
          }, this));
        }
      }
    },
    /*
      Location hash change handler
      The hash determines:
        1) which page we're on
        2) data passed to the page
      */
    syncPageToHash: function() {
      var cellpath, data, fullpath, jsondata, k, kv, v, _i, _len, _ref, _ref2, _ref3;
      _ref = (fullpath = location.hash.slice(3)).split('?'), cellpath = _ref[0], jsondata = _ref[1];
      data = {};
      if (jsondata) {
        _ref2 = jsondata.split('&');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          kv = _ref2[_i];
          _ref3 = kv.split('='), k = _ref3[0], v = _ref3[1];
          data[k] = v;
        }
      }
      this.loadAndChangePage(fullpath, cellpath || 'pages/watch/Watch', data);
      return false;
    },
    init: function() {
      if (S.isIOSFullScreen) {
        return this.options["class"] = 'IOSFullScreenApp';
      }
    },
    render: function(_) {
      return [_('#header', _('.title', ' ')), _('#content'), _('#footer', _('ul', _('li', 'Watch'), _('li', 'Schedule'), _('li', 'Search')))];
    },
    afterRender: function() {
      if (S.isIOS && !S.isIOSFullScreen) {
        setTimeout(hideIOSAddressBar, 50);
        $(window).bind('resize', hideIOSAddressBar);
      }
      this.$content = this.$('#content');
      this.$title = this.$('#header > .title');
      $(window).bind('hashchange', __bind(function() {
        return this.syncPageToHash();
      }, this));
      return this.syncPageToHash();
    }
  };
});