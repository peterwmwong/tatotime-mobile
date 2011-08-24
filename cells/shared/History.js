define(function() {
  var hist, wasLastBack;
  hist = [];
  wasLastBack = false;
  hist.back = function() {
    if (hist.length > 1) {
      wasLastBack = true;
      window.location.hash = "#!/" + (hist.splice(0, 2)[1]);
      return console.log(hist);
    }
  };
  hist.forward = function(path) {
    wasLastBack = false;
    return hist.unshift(path);
  };
  hist.wasLastBack = function() {
    return wasLastBack;
  };
  return hist;
});