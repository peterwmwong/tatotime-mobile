define [
  'data/JSONP'
],({JSONPService})->
	
  new JSONPService 'show',
    baseURL: 'api/show/'
    methods:
      getDetails: (sid)-> "#{sid}/shows"
