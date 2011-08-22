define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  var createDisplayableDate, i, offsetDayMap, today;
  today = new Date();
  offsetDayMap = ['Today', 'Yesterday'].concat((function() {
    var _results;
    _results = [];
    for (i = 2; i < 7; i++) {
      _results.push("" + i + " days ago");
    }
    return _results;
  })(), "a week ago");
  createDisplayableDate = function(o) {
    if (today.getYear() === o.getYear() && today.getMonth() === o.getMonth()) {
      return offsetDayMap[today.getDate() - o.getDate()];
    } else {
      return o.toLocaleDateString();
    }
  };
  return {
    init: function() {
      return this.options.pageService.setTitle('Watch');
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