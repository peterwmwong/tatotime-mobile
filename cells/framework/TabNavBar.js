define(function() {
  var rendertabs;
  rendertabs = function(_, tabs) {
    var tabid, text, _results;
    _results = [];
    for (tabid in tabs) {
      text = tabs[tabid].text;
      _results.push(_("<li data-tabid='" + tabid + "'>", text || tabid));
    }
    return _results;
  };
  return {
    tag: '<ul>',
    render: function(_, A) {
      var tabs;
      if (tabs = this.model.tabs) {
        return rendertabs(_, tabs);
      } else {
        return this.model.bind('change:tabs', function(tabs) {
          return A(renderTabs(tabs));
        });
      }
    },
    on: {
      'click li': function(_arg) {
        var target;
        target = _arg.target;
        $('li.active').removeClass('active');
        return this.model.set('currentTab', $(target).addClass('active').data('tabid'));
      }
    }
  };
});