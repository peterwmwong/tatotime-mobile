define({
  render: function(_, A) {
    return [_('#backbutton', _('span', 'Back')), _('#titles', _('#title'), _('#prevtitle')), _('#gobutton', _('span', 'Do It'))];
  },
  afterRender: function() {
    var $backbutton, $backbuttonText, $prevtitle, $title, animating, handleCurrentChange, handleCurrentHistoryChange, handleTitleChange, model;
    animating = false;
    model = this.model;
    $backbutton = this.$('#backbutton');
    $backbuttonText = this.$('#backbutton > span');
    $title = this.$('#title');
    $prevtitle = this.$('#prevtitle');
    $title.bind('webkitAnimationEnd', function() {
      $title.attr('class', '');
      $prevtitle.attr('class', '');
      return animating = false;
    });
    handleTitleChange = function(title) {
      return $title.html(title || '');
    };
    handleCurrentChange = function(cur) {
      var curHist, e, hasHistory, prevTitle, rev;
      prevTitle = $title.html();
      cur.bind('change:title', handleTitleChange);
      handleTitleChange(cur.title);
      if (!animating) {
        curHist = model.currentHistory;
        hasHistory = curHist.length() > 1;
        $backbutton.css('visibility', hasHistory && 'visible' || 'hidden');
        rev = curHist.wasLastBack && '-reverse' || '';
        if (e = curHist._hist[1]) {
          $backbuttonText.html(e.title);
        }
        if (prevTitle) {
          $prevtitle.html(prevTitle).attr('class', 'headingOut' + rev);
        }
        $title.attr('class', 'headingIn' + rev);
        return animating = true;
      }
    };
    model.bind('change:currentHistory', handleCurrentHistoryChange = function(curHist) {
      if (curHist) {
        curHist.bind('change:current', handleCurrentChange);
        return handleCurrentChange(curHist.current);
      }
    });
    return handleCurrentHistoryChange(model.currentHistory);
  },
  on: {
    'click #backbutton': function() {
      return this.model.trigger('goback');
    }
  }
});