var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var renderList;
  renderList = function(list) {
    var link, text, _, _i, _len, _ref, _results;
    _ = cell.renderHelper;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      _ref = list[_i], text = _ref.text, link = _ref.link;
      _results.push(_('li', _('a', {
        href: link
      }, text)));
    }
    return _results;
  };
  return {
    'render <ul data-role="listview">': function(_, A) {
      var getList, list, _ref;
      _ref = this.options, list = _ref.list, getList = _ref.getList;
      if (list) {
        renderList(list);
      } else if (getList) {
        getList(__bind(function(list) {
          return A(renderList(list));
        }, this));
      }
    },
    bind: {
      afterRender: function() {
        try {
          this.$el.listview('refresh');
        } catch (_e) {}
        return false;
      }
    }
  };
});