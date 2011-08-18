define(['data/JSONP'], function(_arg) {
  var JSONPService;
  JSONPService = _arg.JSONPService;
  return new JSONPService('show', {
    baseURL: 'api/show/',
    methods: {
      getDetails: function(sid) {
        return "" + sid + "/shows";
      }
    }
  });
});