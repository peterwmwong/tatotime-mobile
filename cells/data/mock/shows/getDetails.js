define(['data/mock/shows/allShows'], function(allShows) {
  var count, _;
  _ = function(o) {
    return o;
  };
  count = 0;
  return function(path) {
    var id;
    id = (function() {
      var s;
      s = path.split('/');
      return s[s.length - 1];
    })();
    return allShows[id];
  };
});