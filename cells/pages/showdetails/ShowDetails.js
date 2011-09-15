var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.titleGroup', _('h2.title'), _('h4.year'), _('h4.network')), _('p.description'), _('.castGroup', _('h4.castHeader', 'Cast'), _('#castListContainer', ''))];
    },
    afterRender: function() {
      this.model.bind({
        'activate': __bind(function() {
          return this.$('#castListView').trigger('resetActive');
        }, this)
      });
      return this.model.bindAndCall({
        'change:data': __bind(function(_arg) {
          var data;
          data = _arg.cur;
          this.model.set({
            title: 'Loading...'
          });
          return S.show.getDetails(data.id, __bind(function(d) {
            this.model.set({
              title: d.title
            });
            this.$('.title').html(d.title);
            this.$('.year').html(d.year);
            this.$('.description').html((d.description.length <= 125) && d.description || ("" + (d.description.slice(0, 125)) + "..."));
            this.$('.network').html(d.network);
            this.$('#ListView').remove();
            this.$('#castListContainer').append(cell.prototype.$R(ListView, {
              id: 'castListView',
              list: (function() {
                var id, name, _i, _len, _ref, _ref2, _results;
                _ref = d.cast;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  _ref2 = _ref[_i], id = _ref2.id, name = _ref2.name;
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