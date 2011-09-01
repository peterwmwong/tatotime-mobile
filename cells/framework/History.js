var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['./Model'], function(Model) {
  var History, hash, parseHash;
  hash = function(fullpath) {
    return "#!/" + fullpath;
  };
  parseHash = function(defaultCellPath) {
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
      cellpath = defaultCellPath;
    }
    return new Model({
      cellpath: cellpath,
      fullpath: fullpath,
      data: data,
      title: 'Loading...'
    });
  };
  History = (function() {
    __extends(History, Model);
    function History(_arg) {
      this.defaultCellPath = _arg.defaultCellPath;
      History.__super__.constructor.call(this, {
        wasLastBack: false,
        length: function() {
          return this._hist.length;
        },
        current: parseHash(this.defaultCellPath)
      });
      this._hist = [this.current];
      $(window).bind('hashchange', __bind(function() {
        return this._doHashChange();
      }, this));
    }
    History.prototype.goBack = function() {
      if (this._hist.length > 1) {
        window.location.hash = hash(this._hist[1].fullpath);
        return this._doHashChange();
      }
    };
    /*
        Location hash change handler
        The hash determines:
          1) which page we're on
          2) data passed to the page
        */
    History.prototype._doHashChange = function() {
      var entry, _ref;
      entry = parseHash();
      if (entry.fullpath !== this.current.fullpath) {
        if (((_ref = this._hist[1]) != null ? _ref.fullpath : void 0) === entry.fullpath) {
          this._hist.shift();
          this._hist[0].data = entry.data;
          this.set({
            wasLastBack: true
          });
        } else {
          this._hist.unshift(entry);
          this.set({
            wasLastBack: false
          });
        }
        window.location.hash = hash(entry.fullpath);
        return this.set({
          current: this._hist[0]
        });
      }
    };
    return History;
  })();
  return History;
});