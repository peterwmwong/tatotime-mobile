var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return S.show.getDetails(this.options.id, __bind(function(_arg) {
        var description, title;
        title = _arg.title, description = _arg.description;
        return A([_('h2', title + this.options.id), _('p', description)]);
      }, this));
    }
  };
});