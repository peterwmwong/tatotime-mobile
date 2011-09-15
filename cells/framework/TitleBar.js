var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define({
  render: function(_, A) {
    return [_('#backbutton', _('span', 'Back')), _('#titles', _('#title'), _('#prevtitle')), _('#gobutton', _('span', 'Do It'))];
  },
  afterRender: function() {
    var $backbutton, $backbuttonText, $prevtitle, $title, animating, pageHistoryLengthMap;
    animating = false;
    $backbutton = this.$('#backbutton');
    $backbuttonText = this.$('#backbutton > span');
    $title = this.$('#title');
    $prevtitle = this.$('#prevtitle');
    pageHistoryLengthMap = {};
    $title.bind('webkitAnimationEnd', function() {
      $title.attr('class', '');
      $prevtitle.attr('class', '');
      return animating = false;
    });
    return this.model.bindAndCall({
      'change:currentContext.currentPageModel.title': __bind(function(_arg) {
        var cur, curCtx, e, pageHistory, prevHistoryLength, prevTitle, rev, _name, _ref;
        cur = _arg.cur;
        prevTitle = $title.html();
        $title.html(cur || '');
        if (!animating && (curCtx = this.model.currentContext)) {
          pageHistory = curCtx.pageHistory;
          $backbutton.css('visibility', (pageHistory.length > 1) && 'visible' || 'hidden');
          prevHistoryLength = ((_ref = pageHistoryLengthMap[_name = curCtx.id]) != null ? _ref : pageHistoryLengthMap[_name] = pageHistory.length);
          rev = prevHistoryLength > pageHistory.length && '-reverse' || '';
          pageHistoryLengthMap[curCtx.id] = pageHistory.length;
          if (e = pageHistory[1]) {
            $backbuttonText.html(e.title);
          }
          if (prevTitle) {
            $prevtitle.html(prevTitle).attr('class', 'animate headingOutFade' + rev);
          }
          $title.attr('class', 'animate headingInFade' + rev);
          return animating = true;
        }
      }, this)
    });
  },
  on: {
    'click #backbutton': function() {
      return this.model.trigger('goback');
    }
  }
});