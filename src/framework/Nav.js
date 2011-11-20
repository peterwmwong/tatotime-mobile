
define(['AppConfig', 'HashDelegate', './Model'], function(AppConfig, HashDelegate, Model) {
  var Nav, contextHists, ctx, hashRx, parseHash, toHash, _backHash;
  hashRx = /^\#([^!^?]+)(!([^?]+))?(\?(.+))?/;
  _backHash = void 0;
  Nav = new Model({
    toHash: toHash = function(_arg) {
      var context, ctx, data, hash, k, page, prefix, v;
      context = _arg.context, page = _arg.page, data = _arg.data;
      ctx = (AppConfig.contexts[context] && context) || AppConfig.defaultContext;
      hash = "#" + ctx + "!" + (page || AppConfig.contexts[ctx].defaultPagePath);
      if (data) {
        prefix = '?';
        for (k in data) {
          v = data[k];
          hash += "" + prefix + k + "=" + (encodeURIComponent(v));
          prefix = '&';
        }
      }
      return hash;
    },
    parseHash: parseHash = function(hash) {
      var context, ctxid, page, result;
      result = hashRx.exec(hash);
      return {
        hash: hash,
        context: context = (ctxid = result != null ? result[1] : void 0) && AppConfig.contexts[ctxid] ? ctxid : AppConfig.defaultContext,
        page: (page = result != null ? result[3] : void 0) && (page.substr(-1) !== '/') ? page : AppConfig.contexts[context].defaultPagePath,
        data: (function() {
          var data, jsondata, k, kv, v, _i, _len, _ref, _ref2;
          data = {};
          if (jsondata = result != null ? result[5] : void 0) {
            _ref = jsondata.split('&');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              kv = _ref[_i];
              _ref2 = kv.split('='), k = _ref2[0], v = _ref2[1];
              data[k] = decodeURIComponent(v);
            }
          }
          return data;
        })()
      };
    },
    current: new Model(parseHash(HashDelegate.get())),
    canBack: function() {
      var _ref;
      return ((_ref = contextHists[Nav.current.context]) != null ? _ref.length : void 0) > 1;
    },
    goBack: function() {
      var hist;
      hist = contextHists[Nav.current.context];
      if (hist.length > 1) {
        _backHash = hist[1];
        return HashDelegate.set(_backHash.hash);
      }
    },
    goTo: function(pageUrl) {
      return HashDelegate.set("" + Nav.current.context + "!" + pageUrl);
    },
    switchContext: function(ctxid) {
      var hist;
      if (typeof ctxid === 'string' && (hist = contextHists[ctxid]) && Nav.current.context !== ctxid) {
        return HashDelegate.set(toHash(hist[0] || {
          context: ctxid,
          page: AppConfig.contexts[ctxid].defaultPage
        }));
      }
    }
  });
  window.ctxHists = contextHists = {};
  for (ctx in AppConfig.contexts) {
    contextHists[ctx] = [];
  }
  contextHists[Nav.current.context].push(Nav.current);
  Nav.bind({
    'change:current': function(e) {
      var event, k, v;
      event = {};
      for (k in e) {
        v = e[k];
        event[k] = v;
      }
      event.type = "change:current[context=" + e.cur.context + "]";
      return Nav.trigger(event);
    }
  });
  HashDelegate.onChange(function() {
    var ctxHist, h, i, _ref, _ref2;
    h = new Model(Nav.parseHash(HashDelegate.get()));
    ctxHist = contextHists[h.context];
    if (Nav.current.context !== h.context) {
      _backHash = void 0;
      return Nav.set({
        current: h
      }, {
        isBack: false,
        isContextSwitch: true
      });
    } else if (_backHash) {
      i = 0;
      while (ctxHist[i].hash !== _backHash.hash) {
        ++i;
      }
      h = _backHash;
      _backHash = void 0;
      ctxHist.splice(0, i);
      return Nav.set({
        current: h
      }, {
        isBack: true,
        isContextSwitch: false
      });
    } else if (h.hash === ((_ref = ctxHist[1]) != null ? _ref.hash : void 0)) {
      _backHash = void 0;
      ctxHist.splice(0, 1);
      return Nav.set({
        current: h
      }, {
        isBack: true,
        isContextSwitch: false
      });
    } else if (ctxHist.length < 1 || ((_ref2 = ctxHist[0]) != null ? _ref2.hash : void 0) !== h.hash) {
      _backHash = void 0;
      ctxHist.unshift(h);
      return Nav.set({
        current: h
      }, {
        isBack: false,
        isContextSwitch: false
      });
    }
  });
  return Nav;
});
