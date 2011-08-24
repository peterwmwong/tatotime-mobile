define(['data/mock/actors/allActors'], function(actors) {
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
    return actors[id];
  };
});