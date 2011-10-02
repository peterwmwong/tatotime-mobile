var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'shared/DateHelper', 'cell!shared/ListView'], function(S, DateHelper, ListView) {
  return {
    init: function() {
      this.model.set({
        title: DateHelper.getDisplayable(new Date())
      });
      return this.model.bind({
        'activate': __bind(function() {
          return this.$('#ShowList').trigger('resetActive');
        }, this)
      });
    },
    render: function(_, A) {
      return S.user.getShows(new Date(), __bind(function(shows) {
        var i;
        A([
          _(ListView, {
            id: 'ShowList',
            list: (function() {
              var _results;
              _results = [];
              for (i = 0; i <= 10; i++) {
                _results.push((function() {
                  return {
                    link: "#Watch!go/no/where",
                    text: "" + i
                  };
                })());
              }
              return _results;
            })()
          })
        ]);
        return this.model.trigger('refreshScroller');
      }, this));
    }
  };
});