define(function() {
  var PageService;
  return PageService = (function() {
    function PageService(pagecellpath) {
      this.pagecellpath = pagecellpath;
      this._title = '';
      this.$ev = $(document.createElement('div'));
    }
    PageService.prototype.getTitle = function() {
      return this._title;
    };
    PageService.prototype.setTitle = function(newTitle) {
      this._title = newTitle;
      return this.$ev.trigger({
        type: 'titleChange',
        title: this._title
      });
    };
    PageService.prototype.bind = function(type, handler) {
      return this.$ev.bind(type, handler);
    };
    PageService.prototype.unbind = function(type, handler) {
      return this.$ev.unbind(type, handler);
    };
    return PageService;
  })();
});