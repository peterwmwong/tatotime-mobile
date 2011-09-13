var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['./Model'], function(Model) {
  var HashManager, hashRx;
  hashRx = /^\#([^!^?]+)(!([^?]+))?(\?(.+))?/;
  return HashManager = (function() {
    __extends(HashManager, Model);
    function HashManager(_arg) {
      var _ref;
      _ref = _arg.appConfig, this._ctxs = _ref.contexts, this._defctx = _ref.defaultContext, this.hashDelegate = _arg.hashDelegate;
      HashManager.__super__.constructor.call(this, {
        current: this.parseHash(this.hashDelegate.get())
      });
      this.bind({
        'change:current': __bind(function(e) {
          var event, k, v;
          event = {};
          for (k in e) {
            v = e[k];
            event[k] = v;
          }
          event.type = "change:current[context=" + e.cur.context + "]";
          return this.trigger(event);
        }, this)
      });
      this.hashDelegate.onChange(__bind(function() {
        var cur;
        if (this.current !== (cur = this.parseHash(this.hashDelegate.get()))) {
          return this.set({
            current: cur
          });
        }
      }, this));
    }
    HashManager.prototype.toHash = function(_arg) {
      var context, ctx, data, hash, k, page, prefix, v;
      context = _arg.context, page = _arg.page, data = _arg.data;
      hash = ("#" + (ctx = (this._ctxs[context] && context) || this._defctx)) + ("!" + (page || this._ctxs[ctx].defaultPagePath));
      if (data) {
        prefix = '?';
        for (k in data) {
          v = data[k];
          hash += "" + prefix + k + "=" + (encodeURIComponent(v));
          prefix = '&';
        }
      }
      return hash;
    };
    HashManager.prototype.parseHash = function(hash) {
      var context, ctxid, page, result;
      result = hashRx.exec(hash);
      return {
        hash: hash,
        context: context = (ctxid = result != null ? result[1] : void 0) && this._ctxs[ctxid] ? ctxid : this._defctx,
        page: (page = result != null ? result[3] : void 0) && (page.substr(-1) !== '/') ? page : this._ctxs[context].defaultPagePath,
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
            data;
          }
          return data;
        })()
      };
    };
    return HashManager;
  })();
});