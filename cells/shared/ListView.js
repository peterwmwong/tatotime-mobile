define({
  tag: '<ul>',
  render: function(_, A) {
    var link, list, text, _i, _len, _ref, _results;
    if (list = this.options.list) {
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        _ref = list[_i], text = _ref.text, link = _ref.link;
        _results.push(_("<li data-dest='" + link + "'>", text));
      }
      return _results;
    }
  },
  on: {
    'click li': function(e) {
      $('li.active').removeClass('active');
      return window.location.hash = $(e.target).addClass('active').data('dest');
    }
  }
});