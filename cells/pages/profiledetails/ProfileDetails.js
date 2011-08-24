var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.nameGroup', _('h2.name'), _('h4.bornInfo')), _('.knownForGroup', _('h4.knownForHeader', 'Known For'), _('.knownForList', ''))];
    },
    afterRender: function() {
      this.model.bind('change:data', __bind(function(data) {
        return this.update(data);
      }, this));
      return this.update(this.model.data);
    },
    update: function(_arg) {
      var id;
      id = _arg.id;
      this.model.set('title', void 0);
      return S.actor.getDetails(id, __bind(function(_arg2) {
        var born, knownFor, name;
        name = _arg2.name, born = _arg2.born, knownFor = _arg2.knownFor;
        this.model.set('title', name);
        this.$('.name').html(name);
        this.$('.bornInfo').html(born.year);
        this.$('.knownForList > .ListView').remove();
        this.$('.knownForGroup > .knownForList').append(cell.prototype.$R(ListView, {
          list: (function() {
            var role, title, _i, _len, _ref, _results;
            _results = [];
            for (_i = 0, _len = knownFor.length; _i < _len; _i++) {
              _ref = knownFor[_i], id = _ref.id, role = _ref.role, title = _ref.title;
              _results.push((function() {
                return {
                  text: title,
                  link: "#!/pages/showdetails/ShowDetails?id=" + id
                };
              })());
            }
            return _results;
          })()
        }));
        return this.model.trigger('refreshScroller');
      }, this));
    }
  };
});