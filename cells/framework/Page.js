var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', './Model'], function(require, Model) {
  return {
    tag: function() {
      return "<div data-cellpath='" + this.model.page + "'>";
    },
    render: function(_, A) {
      return require(["cell!" + this.model.page], __bind(function(page) {
        return A([
          _(page, {
            model: this.model
          })
        ]);
      }, this));
    },
    afterRender: function() {
      var scroller;
      scroller = new iScroll(this.el);
      this.model.bindAndCall({
        'refreshScroller': function() {
          return scroller.refresh();
        }
      });
      return this.model.bind({
        'activate': function(_arg) {
          var data;
          data = _arg.data;
          return !data && scroller.scrollTo(0, 0, 0);
        }
      });
    }
  };
});