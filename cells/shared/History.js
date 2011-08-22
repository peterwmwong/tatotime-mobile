define(function() {
  var hist;
  hist = [];
  hist.addOrRewind = function(fullpath) {
    var i;
    if ((i = this.indexOf(fullpath)) === -1) {
      this.unshift(fullpath);
      return true;
    } else {
      this.splice(0, i);
      return false;
    }
  };
  hist.indexOf = function(path) {
    var i, p, _len;
    for (i = 0, _len = this.length; i < _len; i++) {
      p = this[i];
      if (p === path) {
        return i;
      }
    }
    return -1;
  };
  return hist;
});