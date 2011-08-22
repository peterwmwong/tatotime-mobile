var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', 'cell!pages/watch/Watch'], function(require, S) {
  var changePage, curScroller, hideIOSAddressBar, hist, iterCount, makeScroller, pageCellRegistry;
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
  curScroller = null;
  iterCount = 0;
  hideIOSAddressBar = function() {
    $('#header .title').html(iterCount++);
    window.scrollTo(0, 1);
    if (window.pageYOffset <= 0) {
      return setTimeout(hideIOSAddressBar, 50);
    }
  };
  makeScroller = function(pagecell, pagecellpath) {
    var s, scroller;
    s = document.createElement('div');
    s.appendChild(pagecell.el);
    scroller = new iScroll(s);
    scroller.pagecell = pagecell;
    s.className = 'scroller';
    (scroller.$node = $(s)).attr('data-cell-page', pagecellpath);
    return scroller;
  };
  changePage = function(scroller, data) {
    curScroller && curScroller.$node.css('display', 'none');
    (curScroller = scroller).$node.css('display', 'block');
    return setTimeout((function() {
      return scroller.refresh();
    }), 500);
  };
  return {
    /*
      Loads and renders the specified Page Cell if not already loaded.
      If already previously loaded, just $.mobile.changePage to that node.
      */
    loadAndChangePage: function(fullpath, pagecellpath, data) {
      var scroller;
      if (hist[0] !== fullpath) {
        hist.addOrRewind(fullpath);
        if ((scroller = pageCellRegistry[pagecellpath]) != null) {
          changePage(scroller, data);
        } else {
          require(["cell!" + pagecellpath], __bind(function(pagecell) {
            scroller = pageCellRegistry[pagecellpath] = makeScroller(new pagecell(data), pagecellpath);
            scroller.$node.appendTo(this.$content);
            return changePage(scroller, data);
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
    init: function() {
      if (S.isIOSFullScreen) {
        return this.options["class"] = 'IOSFullScreenApp';
      }
    },
    render: function(_) {
      return [_('#header', _('.title', 'TITLE')), _('#content'), _('#footer', _('ul', _('li', 'Watch'), _('li', 'Schedule'), _('li', 'Search')))];
    },
    afterRender: (function() {
      var toggle;
      toggle = true;
      return function() {
        if (S.isIOS && !S.isIOSFullScreen) {
          setTimeout(hideIOSAddressBar, 50);
          $(window).bind('resize', hideIOSAddressBar);
        }
        this.$content = this.$('#content');
        $(window).bind('hashchange', __bind(function() {
          return this.syncPageToHash();
        }, this));
        return this.syncPageToHash();
      };
    })()
  };
});