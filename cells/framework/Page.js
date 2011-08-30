define(['./Model'], function(Model) {
  return {
    tag: function() {
      return "<div data-pagepath='" + this.options.pagepath + "'>";
    },
    init: function() {
      return this.model = new Model({
        pagepath: this.options.cellpath,
        data: this.options.data
      });
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
      this.model.bind('refreshScroller', (refreshScroller = function() {
        return scroller.refresh();
      }));
      refreshScroller();
      return this.model.bind('activate', function(isBackNav) {
        if (!isBackNav) {
          return scroller.scrollTo(0, 0, 0);
        }
      });
    }
  };
});