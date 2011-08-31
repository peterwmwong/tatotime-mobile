define({
  tag: '<ul>',
  render: function(_, A) {
    var dividerText, link, list, text, _i, _len, _ref, _results;
    if (list = this.options.list) {
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        _ref = list[_i], text = _ref.text, link = _ref.link, dividerText = _ref.dividerText;
        if (text || dividerText) {
          _results.push(text ? _("<li data-dest='" + link + "'>", text) : _("li.divider", divderText));
        }
      }
      return _results;
    }
  },
  on: {
    'click li': function(_arg) {
      var target;
      target = _arg.target;
      $('li.active').removeClass('active');
      return window.location.hash = $(target).addClass('active').data('dest');
    }
  }
});