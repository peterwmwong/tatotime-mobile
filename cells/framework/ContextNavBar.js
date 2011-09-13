define({
  tag: '<ul>',
  render: function(_, A) {
    var ctxid, text;
    return [
      (function() {
        var _ref, _results;
        _ref = this.model.appConfig.contexts;
        _results = [];
        for (ctxid in _ref) {
          text = _ref[ctxid].text;
          _results.push(_("<li data-ctxid='" + ctxid + "'>", text || ctxid));
        }
        return _results;
      }).call(this)
    ];
  },
  on: {
    'click li': function(_arg) {
      var target;
      target = _arg.target;
      $('li.active').removeClass('active');
      return this.model.set({
        currentContext: $(target).addClass('active').data('ctxid')
      });
    }
  }
});