define({
  init: function() {
    this.model.tabs = {
      Schedule: {
        defaultPagePath: 'pages/watch/Watch'
      },
      Watch: {
        defaultPagePath: 'pages/watch/Watch'
      },
      Search: {
        defaultPagePath: 'pages/watch/Watch'
      }
    };
    return this.model.defaultTab = 'Schedule';
  }
});