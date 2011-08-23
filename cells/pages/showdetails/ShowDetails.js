var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('h2.title'), _('p.description')];
    },
    afterRender: function() {
      this.$title = this.$('h2.title');
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
        var description, title;
        title = _arg2.title, description = _arg2.description;
        this.model.set('title', title);
        this.$title.html(title);
        return this.$description.html(description);
      }, this));
    }
  };
});