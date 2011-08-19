var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    "extends": 'shared/Page',
    renderContent: function(_, A) {
      return S.show.getDetails(this.options.id, __bind(function(_arg) {
        var description, title;
        title = _arg.title, description = _arg.description;
        this._renderHeader([_('h2', title)]);
        return A([_('p', description)]);
      }, this));
    }
  };
});