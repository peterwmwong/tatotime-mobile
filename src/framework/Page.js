var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', './Nav'], function(require, Nav) {
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
      var active, scroller;
      active = true;
      this.model.bind({
        'deactivate': __bind(function() {
          return active = false;
        }, this)
      });
      this.model.bind({
        'activate': __bind(function() {
          active = true;
          return this.$el.css('visibility', 'visible');
        }, this)
      });
      this.$el.bind('webkitAnimationEnd', __bind(function() {
        if (!active) {
          return this.$el.css('visibility', 'hidden');
        }
      }, this));
      scroller = new iScroll(this.el);
      return this.model.bindAndCall({
        'refreshScroller': function() {
          return scroller.refresh();
        }
      });
    },
    on: {
      "click *[data-navto]": function(_arg) {
        var target;
        target = _arg.target;
        return Nav.goTo($(target).closest('[data-navto]').data('navto'));
      }
    }
  };
});