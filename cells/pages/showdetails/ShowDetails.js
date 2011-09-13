var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.titleGroup', _('h2.title'), _('h4.year'), _('h4.network')), _('p.description'), _('.castGroup', _('h4.castHeader', 'Cast'), _('.castList', ''))];
    },
    afterRender: function() {
      return this.model.bindAndCall({
        'change:data': __bind(function(_arg) {
          var data;
          data = _arg.cur;
          this.model.set({
            title: 'Loading...'
          });
          return S.show.getDetails(data.id, __bind(function(_arg2) {
            var cast, description, network, title, year;
            title = _arg2.title, description = _arg2.description, network = _arg2.network, year = _arg2.year, cast = _arg2.cast;
            this.model.set({
              title: title
            });
            this.$('.title').html(title);
            this.$('.year').html(year);
            this.$('.description').html((description.length <= 125) && description || ("" + (description.slice(0, 125)) + "..."));
            this.$('.network').html(network);
            this.$('.castGroup > .castList > .ListView').remove();
            this.$('.castGroup > .castList').append(cell.prototype.$R(ListView, {
              list: (function() {
                var id, name, _i, _len, _ref, _results;
                _results = [];
                for (_i = 0, _len = cast.length; _i < _len; _i++) {
                  _ref = cast[_i], id = _ref.id, name = _ref.name;
                  _results.push((function() {
                    return {
                      link: "#Schedule!pages/profiledetails/ProfileDetails?id=" + id + "&title=" + name,
                      text: name
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