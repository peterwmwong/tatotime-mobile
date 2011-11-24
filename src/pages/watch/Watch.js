
define(['Services', 'shared/DateHelper', 'cell!shared/ListView'], function(S, DateHelper, ListView) {
  return {
    init: function() {
      var _this = this;
      this.model.set({
        title: DateHelper.getDisplayable(new Date())
      });
      return this.model.bind({
        'activate': function() {
          return _this.$('#ShowList').trigger('resetActive');
        }
      });
    },
    render: function(_) {
      var _this = this;
      return S.user.getShows(new Date(), function(shows) {
        var i;
        _this.$el.append(_(ListView, {
          id: 'ShowList',
          list: (function() {
            var _results;
            _results = [];
            for (i = 0; i <= 10; i++) {
              _results.push({
                link: "pages/showdetails/ShowDetails?id=" + i,
                text: "" + i
              });
            }
            return _results;
          })()
        }));
        return _this.model.trigger('refreshScroller');
      });
    }
  };
});
