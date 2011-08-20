var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', 'cell!pages/watch/Watch'], function(require, S) {
  var $curPageCell, hideAddressBar, hist, pageCellRegistry;
  hist = [];
  hist.addOrRewind = function(fullpath) {
    var i;
    if ((i = this.indexOf(fullpath)) === -1) {
      this.unshift(fullpath);
      return true;
    } else {
      this.splice(0, i);
      return false;
    }
  };
  hist.indexOf = function(path) {
    var i, p, _len;
    for (i = 0, _len = this.length; i < _len; i++) {
      p = this[i];
      if (p === path) {
        return i;
      }
    }
    return -1;
  };
  pageCellRegistry = {};
  $curPageCell = null;
  hideAddressBar = function() {
    window.scrollTo(0, 1);
    if (window.pageYOffset <= 0) {
      return setTimeout(hideAddressBar, 10);
    }
  };
  return {
    init: function() {
      this.myscroll = {
        refresh: function() {}
      };
      if (window.navigator.standalone) {
        return this.$el.addClass('appleHomeScreenApp');
      }
    },
    changePage: function($page) {
      $page.toggle(true).trigger('change');
      if ($curPageCell != null) {
        $curPageCell.toggle(false);
      }
      $curPageCell = $page;
      return setTimeout((__bind(function() {
        return this.myscroll.refresh();
      }, this)), 100);
    },
    /*
      Loads and renders the specified Page Cell if not already loaded.
      If already previously loaded, just $.mobile.changePage to that node.
      */
    loadAndChangePage: function(fullpath, pagecellpath, data) {
      var $pagecell, options;
      if (hist[0] !== fullpath) {
        options = {
          transition: hist.length && 'slide' || 'fade',
          reverse: !hist.addOrRewind(fullpath)
        };
        if (($pagecell = pageCellRegistry[pagecellpath]) != null) {
          this.changePage($pagecell);
        } else {
          require(["cell!" + pagecellpath], __bind(function(pagecell) {
            ($pagecell = pageCellRegistry[pagecellpath] = new pagecell(data).$el).prependTo(this.$content).attr('data-cell-page', pagecellpath);
            return this.changePage($pagecell);
          }, this));
        }
      }
    },
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
    render: function(_) {
      return [_('#header', _('.title', 'TITLE')), _('#content', _('div')), _('#footer', _('ul', _('li', _('a', 'Watch')), _('li', _('a', 'Schedule')), _('li', _('a', 'Search'))))];
    },
    bind: {
      afterRender: function() {
        hideAddressBar();
        this.$content = this.$('#content');
        this.myscroll = new iScroll(this.$content[0]);
        $(window).bind('hashchange', __bind(function() {
          return this.syncPageToHash();
        }, this));
        return this.syncPageToHash();
      }
    }
  };
});