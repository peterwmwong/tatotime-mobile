var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.nameGroup', _('h2.name'), _('h4.bornInfo')), _('.knownForGroup', _('h4.knownForHeader', 'Known For'), _('.knownForList', ''))];
    },
    afterRender: function() {
      return this.model.bindAndCall({
        'change:data': __bind(function(_arg) {
          var id, title, _ref;
          _ref = _arg.cur, id = _ref.id, title = _ref.title;
          this.model.set({
            title: title || 'Loading...'
          });
          return S.actor.getDetails(id, __bind(function(_arg2) {
            var born, knownFor, name;
            name = _arg2.name, born = _arg2.born, knownFor = _arg2.knownFor;
            this.model.set({
              title: name
            });
            this.$('.name').html(name);
            this.$('.bornInfo').html(born.year);
            this.$('.knownForList > .ListView').remove();
            this.$('.knownForGroup > .knownForList').append(cell.prototype.$R(ListView, {
              list: (function() {
                var role, _i, _len, _ref2, _results;
                _results = [];
                for (_i = 0, _len = knownFor.length; _i < _len; _i++) {
                  _ref2 = knownFor[_i], id = _ref2.id, role = _ref2.role, title = _ref2.title;
                  _results.push((function() {
                    return {
                      link: "#Schedule!pages/showdetails/ShowDetails?id=" + id + "&title=" + title,
                      text: title
                    };
                  })());
                }
                return _results;
              })()
            }));
            return this.model.trigger('refreshScroller');
          }, this));
        }, this)
      });
    }
  };
});