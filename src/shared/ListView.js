define(['framework/Nav'], function(Nav) {
  return {
    tag: '<ul>',
    render: function(_, A) {
      var dividerText, link, list, text, _i, _len, _ref, _results;
      if (list = this.options.list) {
        _results = [];
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          _ref = list[_i], text = _ref.text, link = _ref.link, dividerText = _ref.dividerText;
          if (text || dividerText) {
            _results.push(text ? _("<li data-navto='" + link + "'>", _('div'), text) : _("li.divider", dividerText));
          }
        }
        return _results;
      }
    },
    on: {
      'resetActive': function() {
        return this.$('li.active').removeClass('active').addClass('deactive');
      },
      'webkitAnimationEnd li > div': function() {
        return this.$('li.deactive').removeClass('deactive');
      },
      'click li': function(_arg) {
        var target;
        target = _arg.target;
        this.$('li.active').removeClass('active');
        return $(target).closest('li').addClass('active');
      }
    }
  };
});