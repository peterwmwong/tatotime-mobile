var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['Services', 'cell!shared/ListView'], function(S, ListView) {
  return {
    render: function(_, A) {
      return [_('img'), _('.titleGroup', _('h2.title'), _('h4.year'), _('h4.network')), _('p.description'), _('.castGroup', _('h4.castHeader', 'Cast'), _('.castList', ''))];
    },
    afterRender: function() {
      this.model.bind('change:data', __bind(function(data) {
        return this.update(data);
      }, this));
      return this.update(this.model.data);
    },
    update: function(_arg) {
      var id, title;
      id = _arg.id, title = _arg.title;
      this.model.set({
        title: title || 'Loading...'
      });
      return S.show.getDetails(id, __bind(function(_arg2) {
        var cast, description, network, title, year;
        title = _arg2.title, description = _arg2.description, network = _arg2.network, year = _arg2.year, cast = _arg2.cast;
        this.model.set({
          title: title
        });
        this.$('.title').html(title);
        this.$('.year').html(year);
        this.$('.description').html((function() {
          if (description.length > 125) {
            return description.slice(0, 125) + " ...";
          } else {
            return description;
          }
        })());
        this.$('.network').html(network);
        this.$('.castGroup > .castList > .ListView').remove();
        this.$('.castGroup > .castList').append(cell.prototype.$R(ListView, {
          list: (function() {
            var name, _i, _len, _ref, _results;
            _results = [];
            for (_i = 0, _len = cast.length; _i < _len; _i++) {
              _ref = cast[_i], id = _ref.id, name = _ref.name;
              _results.push((function() {
                return {
                  link: "#!/pages/profiledetails/ProfileDetails?id=" + id + "&title=" + name,
                  text: name
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