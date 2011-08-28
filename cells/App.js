var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', 'Services', 'shared/History', 'shared/Model', 'cell!shared/Page', 'cell!pages/watch/Watch'], function(require, S, History, Model, Page) {
  var curPage, hideIOSAddressBar, pageCache;
  document.body.addEventListener('touchmove', function(e) {
    return e.preventDefault();
  });
  pageCache = {};
  curPage = null;
  hideIOSAddressBar = function() {
    window.scrollTo(0, 1);
    if (window.pageYOffset <= 0) {
      return setTimeout(hideIOSAddressBar, 50);
    }
  };
  return {
    changeTitle: function(newTitle) {
      var rev, title;
      rev = History.wasLastBack && '-reverse' || '';
      if (title = this.$title.html()) {
        this.$prevtitle.html(this.$title.html()).attr('class', 'headingOut' + rev);
      }
      if (newTitle) {
        return this.$title.html(newTitle).attr('class', 'headingIn' + rev);
      } else {
        return this.$title.html('');
      }
    },
    changePage: function(page) {
      var pageInClass, rev;
      pageInClass = curPage ? (rev = History.wasLastBack && '-reverse' || '', curPage.$el.attr('class', 'Page headingOut' + rev), curPage.model.trigger('deactivate'), 'Page headingIn' + rev) : 'Page fadeIn';
      (curPage = page).$el.attr('class', pageInClass);
      curPage.model.trigger('activate', History.wasLastBack);
      return this.changeTitle(curPage.model.title);
    },
    /*
      Loads and renders the specified Page Cell if not already loaded.
      If already previously loaded, just change to it.
      */
    loadAndChangePage: function() {
      var cellpath, data, fullpath, page, _ref;
      _ref = History.current, fullpath = _ref.fullpath, cellpath = _ref.cellpath, data = _ref.data;
      this.$('#backbutton').css('visibility', (History.length() > 1) && 'visible' || 'hidden');
      if ((page = pageCache[cellpath]) != null) {
        page.model.set('data', data);
        this.changePage(page);
      } else {
        require(["cell!" + cellpath], __bind(function(pagecell) {
          page = pageCache[cellpath] = new Page({
            cell: pagecell,
            model: new Model({
              pagepath: cellpath,
              data: data
            })
          });
          page.$el.appendTo(this.$content);
          page.model.bind('change:title', __bind(function(title) {
            if (curPage.model.cellpath === History.cellpath) {
              return this.changeTitle(curPage.model.title);
            }
          }, this));
          return this.changePage(page);
        }, this));
      }
    },
    init: function() {
      if (S.isIOSFullScreen) {
        return this.options["class"] = 'IOSFullScreenApp';
      }
    },
    render: function(_) {
      return [_('#header', _('#backbutton', _('span', 'Back')), _('#title', ' '), _('#prevtitle', ' '), _('#forwardbutton', _('span', 'Do It'))), _('#content'), _('#footer', _('ul', _('li', 'Watch'), _('li', 'Schedule'), _('li', 'Search')))];
    },
    afterRender: function() {
      if (S.isIOS && !S.isIOSFullScreen) {
        setTimeout(hideIOSAddressBar, 50);
        $(window).bind('resize', hideIOSAddressBar);
      }
      this.$content = this.$('#content');
      this.$title = this.$('#title');
      this.$title.bind('webkitAnimationEnd', __bind(function() {
        return this.$title.attr('class', '');
      }, this));
      this.$prevtitle = this.$('#prevtitle');
      this.$prevtitle.bind('webkitAnimationEnd', __bind(function() {
        return this.$prevtitle.attr('class', '');
      }, this));
      History.bind('change:current', __bind(function(cur) {
        return this.loadAndChangePage();
      }, this));
      return this.loadAndChangePage();
    },
    on: {
      'click #backbutton': function() {
        return History.goBack();
      }
    }
  };
});