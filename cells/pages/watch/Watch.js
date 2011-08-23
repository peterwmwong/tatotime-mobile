var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'shared/DateHelper', 'cell!shared/ListView'], function(S, DateHelper, ListView) {
  return {
    init: function() {
      this.model.set('title', DateHelper.getDisplayable(new Date()));
      return this.model.bind('activate', __bind(function() {
        return this.$('.ListView li.active').removeClass('active');
      }, this));
    },
    render: function(_, A) {
      return S.user.getShows(function(shows) {
        var s;
        return A([
          _(ListView, {
            list: (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = shows.length; _i < _len; _i++) {
                s = shows[_i];
                _results.push((function() {
                  return {
                    link: "#!/pages/showdetails/ShowDetails?id=" + s.id,
                    text: s.title
                  };
                })());
              }
              return _results;
            })()
          })
        ]);
      });
    }
  };
});