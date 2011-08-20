var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var renderList, _;
  _ = cell.renderHelper;
  renderList = function(list) {
    var link, text, _i, _len, _ref, _results;
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
    'render <ul>': function(_, A) {
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
      'click a': function(e) {
        $('li.active').removeClass('active');
        return $(e.target).closest('li').addClass('active');
      }
    }
  };
});