var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', 'shared/DateHelper', 'cell!shared/ListView'], function(require, S, DateHelper, ListView) {
  var ShowDetailsPage;
  ShowDetailsPage = 'pages/showdetails/ShowDetails';
  return {
    init: function() {
      require([ShowDetailsPage], function() {});
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
                    link: "" + ShowDetailsPage + "?id=" + s.id + "&title=" + s.title,
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