var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['./Model'], function(Model) {
  var ContextModel;
  return ContextModel = (function() {
    __extends(ContextModel, Model);
    function ContextModel(_arg) {
      var bind, currentPageModel, defaultPagePath, hashManager, id, initialHash, pageHistory;
      id = _arg.id, initialHash = _arg.initialHash, hashManager = _arg.hashManager, defaultPagePath = _arg.defaultPagePath;
      ContextModel.__super__.constructor.call(this, {
        id: id,
        defaultPagePath: defaultPagePath,
        currentPageModel: currentPageModel = new Model(initialHash),
        pageHistory: pageHistory = [currentPageModel]
      });
      (bind = {})["change:current[context=" + id + "]"] = __bind(function(_arg2) {
        var cur, _ref;
        cur = _arg2.cur;
        if (((_ref = pageHistory[1]) != null ? _ref.hash : void 0) === cur.hash) {
          pageHistory.splice(0, 1);
        } else {
          pageHistory.unshift(new Model(cur));
        }
        return this.set({
          currentPageModel: pageHistory[0]
        });
      }, this);
      hashManager.bind(bind);
    }
    return ContextModel;
  })();
});