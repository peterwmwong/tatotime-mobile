define(['shared/PageService'], function(PageService) {
  return {
    tag: function() {
      return "<div data-pagepath='" + this.model.pagePath + "'>";
    },
    render: function(_) {
      return [
        _(this.options.cell, {
          model: this.model
        })
      ];
    },
    afterRender: function() {
      var refreshScroller, scroller;
      scroller = new iScroll(this.el);
      refreshScroller = function() {
        return setTimeout((function() {
          return scroller.refresh();
        }), 500);
      };
      refreshScroller();
      return this.model.bind('change:data', refreshScroller);
    }
  };
});