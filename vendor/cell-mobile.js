var __slice = Array.prototype.slice;
(function() {
  /*
    Helpers
    */
  var $body, L, baseurl, deactiveJQMBtnClass, loadAndChangePage;
  L = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };
  /*
    Effectively, deactivate jquery-mobile navigation model.
    */
  $body = null;
  $(document).bind("mobileinit", function() {
    $.extend($.mobile, {
      hashListeningEnabled: false,
      ajaxEnabled: false
    });
  });
  baseurl = "cells/";
  deactiveJQMBtnClass = function() {
    return setTimeout((function() {
      return $("." + $.mobile.activeBtnClass).removeClass($.mobile.activeBtnClass);
    }), 500);
  };
  /*
    Loads and renders the specified Page Cell if not already loaded.
    If already previously loaded, just $.mobile.changePage to that node.
    */
  loadAndChangePage = (function() {
    var hist, pageCellRegistry;
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
    /*
        1) Render page cell to body
        2) Change page to page cell node
        3) Tell jquery-mobile page loading is done
        */
    return function(fullpath, pagecellpath, data) {
      var isReverse, pagecell, transition;
      if (hist[0] !== fullpath) {
        transition = (hist.length === 0) && 'fade' || 'slide';
        isReverse = !hist.addOrRewind(fullpath);
        if ((pagecell = pageCellRegistry[pagecellpath]) != null) {
          $.mobile.changePage(pagecell.$el, {
            transition: transition,
            reverse: isReverse
          });
          deactiveJQMBtnClass();
        } else {
          require({
            baseUrl: baseurl
          }, ["cell!" + pagecellpath], function(pagecell) {
            var $el;
            pagecell = pageCellRegistry[pagecellpath] = new pagecell(data);
            ($el = pagecell.$el).attr('data-cell-page', pagecellpath);
            $body.prepend($el);
            $.mobile.changePage($el, {
              transition: transition,
              reverse: isReverse
            });
            return deactiveJQMBtnClass();
          });
        }
      }
    };
  })();
  return $(function() {
    var syncPageToHash;
    $body = $('body');
    $(window).bind('hashchange', syncPageToHash = function() {
      var cellpath, data, fullpath, jsondata, k, kv, kvs, v, _i, _len, _ref, _ref2;
      _ref = (fullpath = location.hash.slice(3)).split('?'), cellpath = _ref[0], jsondata = _ref[1];
      data = {};
      if (jsondata && (kvs = jsondata.split('&'))) {
        for (_i = 0, _len = kvs.length; _i < _len; _i++) {
          kv = kvs[_i];
          _ref2 = kv.split('='), k = _ref2[0], v = _ref2[1];
          data[k] = v;
        }
      }
      loadAndChangePage(fullpath, cellpath || 'App', data);
    });
    syncPageToHash();
  });
})();