var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.titleGroup', _('h2.title'), _('h3.year'), _('h3.network')), _('p.description')];
    },
    afterRender: function() {
      this.$title = this.$('h2.title');
      this.$year = this.$('h3.year');
      this.$network = this.$('h3.network');
      this.$description = this.$('p.description');
      this.model.bind('change:data', __bind(function(data) {
        return this.update(data);
      }, this));
      return this.update(this.model.data);
    },
    update: function(_arg) {
      var id;
      id = _arg.id;
      this.model.set('title', void 0);
      return S.show.getDetails(id, __bind(function(_arg2) {
        var description, network, title, year;
        title = _arg2.title, description = _arg2.description, network = _arg2.network, year = _arg2.year;
        this.model.set('title', title);
        this.$title.html(title);
        this.$year.html(year);
        this.$description.html(description);
        return this.$network.html(network);
      }, this));
    }
  };
});