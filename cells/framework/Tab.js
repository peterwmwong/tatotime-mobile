var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['require', './History', './Model', 'cell!./Page'], function(require, History, Model, Page) {
  return {
    init: function() {
      this.pageCache = {};
      this.curPage = null;
      return this.history = new History({
        defaultCellPath: this.options.defaultCellPath
      });
    },
    changeTitle: function(newTitle) {
      return this.model.set('title', newTitle);
    },
    changePage: function(page) {
      var pageInClass, rev;
      pageInClass = this.curPage ? (rev = this.history.wasLastBack && '-reverse' || '', this.curPage.$el.attr('class', 'Page headingOut' + rev), this.curPage.model.trigger('deactivate'), 'Page headingIn' + rev) : 'Page fadeIn';
      (this.curPage = page).$el.attr('class', pageInClass);
      this.curPage.model.trigger('activate', this.history.wasLastBack);
      return this.changeTitle(this.curPage.model.title);
    },
    /*
      Loads and renders the specified Page Cell if not already loaded.
      If already previously loaded, just change to it.
      */
    loadAndChangePage: function() {
      var cellpath, data, fullpath, page, _ref;
      _ref = this.history.current, fullpath = _ref.fullpath, cellpath = _ref.cellpath, data = _ref.data;
      this.$('#backbutton').css('visibility', (this.history.length() > 1) && 'visible' || 'hidden');
      if ((page = this.pageCache[cellpath]) != null) {
        page.model.set('data', data);
        this.changePage(page);
      } else {
        require(["cell!" + cellpath], __bind(function(pagecell) {
          page = this.pageCache[cellpath] = new Page({
            cell: pagecell,
            pagepath: cellpath,
            data: data
          });
          page.$el.appendTo(this.$el);
          page.model.bind('change:title', __bind(function(title) {
            if (this.curPage.model.cellpath === this.history.cellpath) {
              return this.changeTitle(this.curPage.model.title);
            }
          }, this));
          return this.changePage(page);
        }, this));
      }
    },
    afterRender: function() {
      this.history.bind('change:current', __bind(function(cur) {
        return this.loadAndChangePage();
      }, this));
      return this.loadAndChangePage();
    }
  };
});