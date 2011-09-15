var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', './Model', 'cell!./Page'], function(require, Model, Page) {
  return {
    tag: function() {
      return "<div data-ctxid='" + this.model.id + "'>";
    },
    afterRender: function() {
      var curPage, pageCache, pageHistoryLength;
      pageCache = {};
      curPage = null;
      pageHistoryLength = this.model.pageHistory.length;
      return this.model.bindAndCall({
        'change:currentPageModel': __bind(function(_arg) {
          var cur, isback, pageCell, pageInClass, prev, prevPageCell, rev;
          cur = _arg.cur, prev = _arg.prev;
          isback = this.model.pageHistory.length < pageHistoryLength;
          pageHistoryLength = this.model.pageHistory.length;
          if (isback && (pageCell = pageCache[cur.hash])) {
            prevPageCell = pageCache[prev.hash];
            delete pageCache[prev.hash];
            prevPageCell.$el.bind('webkitAnimationEnd', function() {
              return prevPageCell.$el.remove();
            });
          } else {
            pageCell = pageCache[cur.hash] = new Page({
              model: cur
            });
          }
          pageCell.$el.prependTo(this.$el);
          pageInClass = 'Page animate ' + (prev ? (rev = isback && '-reverse' || '', curPage.$el.attr('class', 'Page animate headingOut' + rev), curPage.model.trigger('deactivate'), 'headingIn' + rev) : 'fadeIn');
          (curPage = pageCell).$el.attr('class', pageInClass);
          return curPage.model.trigger({
            type: 'activate',
            isback: isback
          });
        }, this)
      });
    }
  };
});