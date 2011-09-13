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
          var cachedPage, cur, pageInClass, pagePath, prev, rev;
          cur = _arg.cur, prev = _arg.prev;
          pagePath = cur.page;
          if (cachedPage = pageCache[pagePath]) {
            cachedPage.model.set({
              data: cur.data
            });
          } else {
            cachedPage = pageCache[pagePath] = new Page({
              model: cur
            });
            cachedPage.$el.appendTo(this.$el);
          }
          pageInClass = prev ? (rev = this.model.pageHistory.length < pageHistoryLength && '-reverse' || '', curPage.$el.attr('class', 'Page headingOut' + rev), curPage.model.trigger('deactivate'), 'Page headingIn' + rev) : 'Page fadeIn';
          pageHistoryLength = this.model.pageHistory.length;
          (curPage = cachedPage).$el.attr('class', pageInClass);
          return curPage.model.trigger('activate', this.model.pageHistory.wasLastBack);
        }, this)
      });
    }
  };
});