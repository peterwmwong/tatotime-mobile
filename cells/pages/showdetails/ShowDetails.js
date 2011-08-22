var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return S.show.getDetails(this.options.id, __bind(function(_arg) {
        var description, title;
        title = _arg.title, description = _arg.description;
        this.options.pageService.setTitle(title);
        return A([_('h2.title', title), _('p.description', description)]);
      }, this));
    },
    afterRender: function() {
      this.$title = this.$('h2.title');
      return this.$description = this.$('h2.description');
    },
    update: function(options) {
      return S.show.getDetails(options.id, __bind(function(_arg) {
        var description, title;
        title = _arg.title, description = _arg.description;
        console.log('blarg');
        this.options.pageService.setTitle(title);
        this.$title.html(title);
        return this.$description.html(description);
      }, this));
    }
  };
});