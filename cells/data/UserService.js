define(['data/JSONP'], function(_arg) {
  var JSONPService;
  JSONPService = _arg.JSONPService;
  return new JSONPService('user', {
    baseURL: 'api/users/',
    methods: {
      getShows: function() {
        return "" + 'pwong' + "/shows";
      }
    }
  });
});