define(['shared/Model'], function(Model) {
  var History, doHashChange, hash, hist, parseHash;
  hash = function(fullpath) {
    return "#!/" + fullpath;
  };
  parseHash = function() {
    var cellpath, data, fullpath, jsondata, k, kv, v, _i, _len, _ref, _ref2, _ref3;
    _ref = (fullpath = window.location.hash.slice(3)).split('?'), cellpath = _ref[0], jsondata = _ref[1];
    data = {};
    if (jsondata) {
      _ref2 = jsondata.split('&');
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        kv = _ref2[_i];
        _ref3 = kv.split('='), k = _ref3[0], v = _ref3[1];
        data[k] = v;
      }
    }
    if (!cellpath) {
      cellpath = 'pages/watch/Watch';
    }
    return {
      cellpath: cellpath,
      fullpath: fullpath,
      data: data
    };
  };
  History = new Model({
    wasLastBack: false,
    length: function() {
      return hist.length;
    },
    current: parseHash()
  });
  hist = [History.current];
  History.goBack = function() {
    if (hist.length > 1) {
      window.location.hash = hash(hist[1].fullpath);
      return doHashChange();
    }
  };
  /*
    Location hash change handler
    The hash determines:
      1) which page we're on
      2) data passed to the page
    */
  doHashChange = function() {
    var entry, _ref;
    entry = parseHash();
    if (entry.fullpath !== History.current.fullpath) {
      if (((_ref = hist[1]) != null ? _ref.fullpath : void 0) === entry.fullpath) {
        hist.shift();
        hist[0].data = entry.data;
        History.set('wasLastBack', true);
      } else {
        hist.unshift(entry);
        History.set('wasLastBack', false);
      }
      window.location.hash = hash(entry.fullpath);
      History.set('current', hist[0]);
      return false;
    }
  };
  $(window).bind('hashchange', doHashChange);
  return History;
});