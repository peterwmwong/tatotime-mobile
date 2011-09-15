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
        var s;
        A([
          _(ListView, {
            id: 'ShowList',
            list: (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = shows.length; _i < _len; _i++) {
                s = shows[_i];
                _results.push((function() {
                  return {
                    link: "#Schedule!pages/showdetails/ShowDetails?id=" + s.id + "&title=" + s.title,
                    text: s.title
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