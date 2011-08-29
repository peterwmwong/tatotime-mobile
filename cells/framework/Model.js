define(function() {
  return (function() {
    function _Class(attrs) {
      var k, v;
      this._ls = {};
      for (k in attrs) {
        v = attrs[k];
        this[k] = v;
      }
    }
    _Class.prototype.set = function(attr, value) {
      return this.trigger("change:" + attr, (this[attr] = value));
    };
    _Class.prototype.trigger = function(type, data) {
      var l, ls, _i, _len, _results;
      if (ls = this._ls[type]) {
        _results = [];
        for (_i = 0, _len = ls.length; _i < _len; _i++) {
          l = ls[_i];
          _results.push((function() {
            try {
              return l(data);
            } catch (_e) {}
          })());
        }
        return _results;
      }
    };
    _Class.prototype.bind = function(type, handler) {
      var l, ls, _base, _i, _len, _ref;
      ls = ((_ref = (_base = this._ls)[type]) != null ? _ref : _base[type] = []);
      for (_i = 0, _len = ls.length; _i < _len; _i++) {
        l = ls[_i];
        if (l === handler) {
          return;
        }
      }
      return ls.push(handler);
    };
    _Class.prototype.unbind = function(type, handler) {
      var i, l, ls, _len;
      if (ls = this._ls[type]) {
        for (i = 0, _len = ls.length; i < _len; i++) {
          l = ls[i];
          if (l === handler) {
            delete ls[i];
            return;
          }
        }
      }
    };
    return _Class;
  })();
});