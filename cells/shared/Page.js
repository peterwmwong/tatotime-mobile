var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define({
  render: function(_, A) {
    return [_('.header', _('.title')), _('.content'), _('.footer', _('.navbar', _('ul', _('li', _('<a>', 'Watched')), _('li', _('<a>', 'Schedule')), _('li', _('<a>', 'Search')))))];
  },
  _renderHeader: function(nodes) {
    var $header, n, _i, _len, _results;
    if (nodes && !this.header) {
      this.header = nodes;
      $header = this.$('.header');
      $header.html('');
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        _results.push($header.append(n));
      }
      return _results;
    }
  },
  _renderContent: function(nodes) {
    var $content, n, _i, _len;
    if (nodes && !this.content) {
      this.content = nodes;
      $content = this.$('.content');
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        $content.append(n);
      }
    }
  },
  bind: {
    afterRender: function() {
      if (this.renderHeader) {
        this._renderHeader(this.renderHeader(cell.renderHelper, __bind(function(r2) {
          return this._renderHeader(r2);
        }, this)));
      }
      if (this.renderContent) {
        this._renderContent(this.renderContent(cell.renderHelper, __bind(function(r2) {
          return this._renderContent(r2);
        }, this)));
      }
      return false;
    }
  }
});