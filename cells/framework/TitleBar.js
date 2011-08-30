var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define({
  changeTitle: function(title) {
    var rev, _ref, _ref2;
    this.$backbutton.css('visibility', (((_ref = this.model.currentHistory) != null ? _ref.length() : void 0) > 1) && 'visible' || 'hidden');
    rev = ((_ref2 = this.model.currentHistory) != null ? _ref2.wasLastBack : void 0) && '-reverse' || '';
    if (this.$title.html()) {
      this.$prevtitle.html(this.$title.html()).attr('class', 'headingOut' + rev);
    }
    if (title) {
      return this.$title.html(title).attr('class', 'headingIn' + rev);
    } else {
      return this.$title.html('');
    }
  },
  render: function(_, A) {
    return [_('#backbutton', _('span', 'Back')), _('#title', this.model.currentTitle || ' '), _('#prevtitle', ' '), _('#forwardbutton', _('span', 'Do It'))];
  },
  afterRender: function() {
    this.$backbutton = this.$('#backbutton');
    this.$title = this.$('#title');
    this.$title.bind('webkitAnimationEnd', __bind(function() {
      return this.$title.attr('class', '');
    }, this));
    this.$prevtitle = this.$('#prevtitle');
    this.$prevtitle.bind('webkitAnimationEnd', __bind(function() {
      return this.$prevtitle.attr('class', '');
    }, this));
    return this.model.bind('change:currentTitle', __bind(function(title) {
      return this.changeTitle(title);
    }, this));
  },
  on: {
    'click #backbutton': function() {
      return this.model.trigger('goback');
    }
  }
});