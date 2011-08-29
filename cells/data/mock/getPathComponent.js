define(function() {
  var getPathComponent;
  return getPathComponent = function(path) {
    var s;
    return (s = path.split('/'))[s.length - 1];
  };
});