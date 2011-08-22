var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var renderList, _;
  _ = cell.prototype.$R;
  renderList = function(list) {
    var link, text, _i, _len, _ref, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      _ref = list[_i], text = _ref.text, link = _ref.link;
      _results.push(_("<li data-dest='" + link + "'>", text));
    }
    return _results;
  };
  return {
    tag: '<ul>',
    render: function(_, A) {
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
    on: {
      'click li': function(e) {
        $('li.active').removeClass('active');
        return window.location.hash = $(e.target).addClass('active').data('dest');
      }
    }
  };
});