define(['cell!pages/schedule/Schedule'], function() {
  return {
    init: function() {
      this.model.contexts = {
        Schedule: {
          defaultPagePath: 'pages/schedule/Schedule'
        },
        Watch: {
          defaultPagePath: 'pages/watch/Watch'
        },
        Search: {
          defaultPagePath: 'pages/watch/Watch'
        }
      };
      return this.model.defaultContext = 'Schedule';
    }
  };
});