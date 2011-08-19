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
    "extends": 'shared/Page',
    renderHeader: function(_) {
      return [_('.title', createDisplayableDate(today))];
    },
    renderContent: function(_) {
      return [
        _(ListView, {
          getList: function(A) {
            return S.user.getShows(function(shows) {
              return A((function() {
                var s, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = shows.length; _i < _len; _i++) {
                  s = shows[_i];
                  _results.push((function() {
                    return {
                      link: "#!/pages/showdetails/ShowDetails?id=" + s.id,
                      text: s.text
                    };
                  })());
                }
                return _results;
              })());
            });
          }
        })
      ];
    }
  };
});