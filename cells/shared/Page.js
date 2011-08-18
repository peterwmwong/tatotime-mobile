var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define({
  'render <div data-role="page">': function(_, A) {
    return [_('<div data-role="header">', _('<h2>', "sldkfj")), _('<div data-role="content">'), _('<div data-role="footer" data-position="fixed" data-id="footer">', _('<div data-role="navbar" data-position="fixed">', _('<ul>', _('<li>', _('<a>', 'Date')), _('<li>', _('<a>', 'Show')))))];
  },
  renderContent: function(r) {
    var $content, n, _i, _len;
    if (r && !this.content) {
      this.content = r;
      $content = this.$('[data-role="content"]');
      for (_i = 0, _len = r.length; _i < _len; _i++) {
        n = r[_i];
        $content.append(n);
      }
    }
  },
  bind: {
    afterRender: function() {
      this.renderContent(this.renderPage(cell.renderHelper, __bind(function(r2) {
        return this.renderContent(r2);
      }, this)));
      return false;
    }
  }
});