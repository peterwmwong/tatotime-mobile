var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    "extends": 'shared/Page',
    renderPage: function(_, A) {
      return S.show.getDetails(this.options.id, __bind(function(_arg) {
        var description, title;
        title = _arg.title, description = _arg.description;
        return A([_('h1', title), _('p', description)]);
      }, this));
    }
  };
});