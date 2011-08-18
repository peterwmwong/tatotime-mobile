(function() {
  var E, bind, cell, document, exports, extendObj, fbind, inherits, isNode, renderChildren, renderHelper, renderParent, selRx, tagnameRx, window, _ctor, _evNameRx, _evSelRx, _midRelUrlRx, _modNameRx, _optsToProps, _ref, _relUrlRx, _renderFuncNameRx, _slice, _tmpNode;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  E = (typeof (typeof console !== "undefined" && console !== null ? console.error : void 0) === 'function') && (function(msg) {
    return console.error(msg);
  }) || function() {};
  window = this;
  document = window.document || {
    createElement: function() {}
  };
  isNode = typeof Node === 'object' ? function(o) {
    return o instanceof Node;
  } : function(o) {
    return typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
  };
  _slice = Array.prototype.slice;
  bind = (fbind = Function.prototype.bind) ? function(func, obj) {
    return fbind.apply(func, [obj].concat(_slice.call(arguments, 2)));
  } : function(func, obj) {
    var args;
    args = _slice.call(arguments, 2);
    return function() {
      return func.apply(obj, args.concat(_slice.call(arguments)));
    };
  };
  extendObj = function(destObj, srcObj) {
    var p;
    for (p in srcObj) {
      destObj[p] = srcObj[p];
    }
    return destObj;
  };
  _ctor = function() {};
  inherits = function(parent, protoProps) {
    var child;
    child = protoProps && protoProps.hasOwnProperty('constructor') ? protoProps.constructor : function() {
      return parent.apply(this, arguments);
    };
    extendObj(child, parent);
    _ctor.prototype = parent.prototype;
    child.prototype = new _ctor();
    extendObj(child.prototype, protoProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  };
  _tmpNode = document.createElement('div');
  _optsToProps = ['id', 'class', 'model', 'collection'];
    if ((_ref = window.cell) != null) {
    _ref;
  } else {
    window.cell = cell = function(options) {
      var className, n, p, val, _i, _j, _len, _len2, _ref2;
      this.options = options != null ? options : {};
      this._renderNodes = __bind(function(nodes) {
        var r, _i, _len, _ref2;
        renderChildren(this.el, nodes);
        this._isRendering = false;
        this.__delegateEvents();
        this.$el.trigger('afterRender');
        this._isReady = true;
        if (this._readys) {
          _ref2 = this._readys;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            r = _ref2[_i];
            try {
              r(this);
            } catch (_e) {}
          }
          delete this._readys;
        }
      }, this);
      for (_i = 0, _len = _optsToProps.length; _i < _len; _i++) {
        p = _optsToProps[_i];
        if ((val = this.options[p])) {
          this[p] = val;
        }
      }
      _tmpNode.innerHTML = this.__renderOuterHTML;
      this.el = _tmpNode.children[0];
      this.$el = $(this.el);
      className = "";
      _ref2 = [this.cell.prototype.name, this.el.className, this["class"]];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        n = _ref2[_j];
        if (n) {
          className += ' ' + n;
        }
      }
      if (className !== "") {
        this.el.className = className;
      }
      (typeof this.id === 'string') && (this.el.id = this.id);
      this.update();
    };
  };
  window.cell.renderHelper = renderHelper = function() {
    var a, b, children, parent;
    a = arguments[0], b = arguments[1], children = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (a) {
      if ((b != null ? b.constructor : void 0) !== Object) {
        children.unshift(b);
        b = void 0;
      }
      if (parent = renderParent(a, b)) {
        renderChildren(parent, children);
        return parent;
      }
    }
  };
  selRx = /^(\w+)?(#([\w\-]+))?(\.[\w\.\-]+)?$/;
  tagnameRx = /^<(\w+)/;
  renderParent = function(a, b) {
    var bclass, el, k, m, v, _ref2;
    if (typeof a === 'string') {
      if (m = selRx.exec(a)) {
        el = document.createElement(m[1] || 'div');
        if (v = m[3]) {
          el.setAttribute('id', v);
        }
        bclass = '';
        if (b) {
          bclass = b['class'];
          delete b['class'];
          for (k in b) {
            v = b[k];
            el.setAttribute(k, v);
          }
        }
        if (v = m[4]) {
          bclass += v.replace(/\./g, ' ');
        }
        if (bclass) {
          el.setAttribute('class', bclass);
        }
        return el;
      } else if (m = tagnameRx.exec(a)) {
        _tmpNode.innerHTML = "" + a + "</" + m[1] + ">";
        return _tmpNode.children[0];
      } else {
        return E("renderParent: unsupported parent string = '" + a + "'");
      }
    } else if (((_ref2 = a.prototype) != null ? _ref2.cell : void 0) === a) {
      return (new a(b)).el;
    } else if (isNode(a)) {
      return a;
    } else {
      return E("renderParent: unsupported parent type = " + a);
    }
  };
  window.cell.renderChildren = renderChildren = function(parent, children) {
    var c, type, _ref2, _results;
    _results = [];
    while (children.length > 0) {
      if ((c = children.shift()) != null) {
        _results.push(isNode(c) ? parent.appendChild(c) : (_ref2 = (type = typeof c)) === 'string' || _ref2 === 'number' ? parent.appendChild(document.createTextNode(c)) : c instanceof Array ? Array.prototype.unshift.apply(children, c) : !((c === void 0 || c === null) || type === 'boolean') ? E('renderChild: unsupported child type = ' + c) : void 0);
      }
    }
    return _results;
  };
  _renderFuncNameRx = /render([ ]+<(\w+)([ ]+.*)*>[ ]*)?$/;
  _evNameRx = /bind( (.+))?/;
  _evSelRx = /^(\w+)(\s(.*))?$/;
  cell.extend = function(protoProps, name) {
    var bindProp, binds, child, css, cssref, desc, el, handler, match, p, prop, propName, selmatch, tag, _ref2;
    protoProps.__eventBindings = ((_ref2 = this.prototype.__eventBindings) != null ? _ref2.slice(0) : void 0) || [];
    for (propName in protoProps) {
      prop = protoProps[propName];
      if ((match = _evNameRx.exec(propName)) && typeof prop === 'object') {
        bindProp = match[2] || 'el';
        binds = [];
        for (desc in prop) {
          handler = prop[desc];
          if ((selmatch = _evSelRx.exec(desc))) {
            binds.push({
              name: selmatch[1],
              sel: selmatch[3],
              handler: handler
            });
          }
        }
        if (binds.length) {
          protoProps.__eventBindings.push({
            prop: bindProp,
            binds: binds
          });
        }
      } else if (!protoProps.__renderTagName && (match = _renderFuncNameRx.exec(propName))) {
        if (typeof (protoProps.__render = prop) !== 'function') {
          E("cell.extend expects '" + propName + "' to be a function");
          return;
        }
        tag = protoProps.__renderTagName = match[2] || 'div';
        protoProps.__renderOuterHTML = "<" + tag + (match[3] || "") + "></" + tag + ">";
      }
    }
    if (typeof name === 'string') {
      protoProps.name = name;
    }
    child = inherits(this, protoProps);
    if (!(p = child.prototype).__renderTagName) {
      return E('cell.extend([constructor:Function],prototypeMembers:Object): could not find a render function in prototypeMembers');
    } else {
      child.extend = cell.extend;
      p.cell = child;
      if (typeof (css = protoProps.css) === 'string') {
        el = document.createElement('style');
        el.innerHTML = css;
      } else if (typeof (cssref = protoProps.css_href) === 'string') {
        el = document.createElement('link');
        el.href = cssref;
        el.rel = 'stylesheet';
      }
      if (el) {
        el.type = 'text/css';
        $('head')[0].appendChild(el);
      }
      return child;
    }
  };
  cell.prototype = {
    $: function(selector) {
      return $(selector, this.el);
    },
    ready: function(f) {
      var _ref2;
      if (this._isReady) {
        try {
          return f(this);
        } catch (_e) {}
      } else {
        return ((_ref2 = this._readys) != null ? _ref2 : this._readys = []).push(f);
      }
    },
    update: function() {
      var nodes;
      this._isReady = false;
      if (typeof this.init === "function") {
        this.init(this.options);
      }
      this._isRendering = true;
      if ((nodes = this.__render(renderHelper, this._renderNodes)) instanceof Array) {
        this._renderNodes(nodes);
      }
    },
    __delegateEvents: function() {
      var binds, handler, name, obj, prop, sel, ub, _fn, _i, _j, _k, _len, _len2, _len3, _ref2, _ref3, _ref4, _ref5;
      if (this._unbinds) {
        _ref2 = this._unbinds;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          ub = _ref2[_i];
          try {
            ub();
          } catch (_e) {}
        }
        delete this._unbinds;
      }
      this._unbinds = [];
      _ref3 = this.__eventBindings;
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        _ref4 = _ref3[_j], prop = _ref4.prop, binds = _ref4.binds;
        if (isNode(obj = this[prop])) {
          obj = this.$(obj);
          _fn = __bind(function(obj, name, sel, handler) {
            if (typeof handler === 'string') {
              handler = this[handler];
            }
            if (typeof handler === 'function') {
              handler = bind(handler, this);
              this._unbinds.push(sel ? (obj.delegate(sel, name, handler), function() {
                obj.undelegate(sel, name, handler);
              }) : (obj.bind(name, handler), function() {
                obj.unbind(name, handler);
              }));
            }
          }, this);
          for (_k = 0, _len3 = binds.length; _k < _len3; _k++) {
            _ref5 = binds[_k], name = _ref5.name, sel = _ref5.sel, handler = _ref5.handler;
            _fn(obj, name, sel, handler);
          }
        }
      }
    }
  };
  if (typeof define === 'function' && typeof require === 'function') {
    _modNameRx = /(.*\/)?(.*)/;
    _relUrlRx = /^(\.+\/)/;
    _midRelUrlRx = /(\/\.\/)/g;
    define('cell', [], exports = {
      pluginBuilder: 'cell-pluginBuilder',
      load: function(name, req, load, config) {
        req([name], function(CDef) {
          var baseUrl, cellName, _ref2, _ref3, _ref4;
          if (typeof CDef !== 'object') {
            E("Couldn't load " + name + " cell. cell definitions should be objects, but instead was " + (typeof CDef));
          } else {
            _ref2 = _modNameRx.exec(name).slice(1), baseUrl = _ref2[0], cellName = _ref2[1];
            CDef._require = function(dep, cb) {
              return req([("cell!" + (_relUrlex.test(dep) && baseUrl || '') + dep).replace(_midRelUrlex, '/')], cb);
            };
            if (typeof ((_ref3 = exports.__preinstalledCells__) != null ? _ref3[name] : void 0) === 'undefined') {
                            if ((_ref4 = CDef.css_href) != null) {
                _ref4;
              } else {
                CDef.css_href = req.toUrl("" + name + ".css");
              };
            }
            if (typeof CDef["extends"] === 'string') {
              req(["cell!" + CDef["extends"]], function(parentCell) {
                if (parentCell.prototype.name) {
                  CDef["class"] = parentCell.prototype.name + (" " + CDef["class"]) || "";
                }
                load(parentCell.extend(CDef, cellName));
              });
            } else {
              load(cell.extend(CDef, cellName));
            }
          }
        });
      }
    });
    require.onError = function(e) {
      return E(e.originalError.stack);
    };
    require.ready(function() {
      $('[data-cell]').each(function() {
        var baseurl, cachebust, cachebustAttr, cellname, node, opts;
        node = this;
        if (cellname = node.getAttribute('data-cell')) {
          opts = {};
          cachebust = /(^\?cachebust)|(&cachebust)/.test(window.location.search);
          if (((cachebustAttr = node.getAttribute('data-cell-cachebust')) !== null || cachebust) && cachebustAttr !== 'false') {
            opts.urlArgs = "bust=" + (new Date().getTime());
          }
          if (baseurl = node.getAttribute('data-cell-baseurl')) {
            opts.baseUrl = baseurl;
          }
          require(opts, ["cell!" + cellname], function(CType) {
            $(node).append(new CType().el);
          });
        }
      });
    });
    return;
  }
}).call(this);
