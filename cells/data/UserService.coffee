define [
  'data/JSONP'
],({JSONPService})->
  
  new JSONPService 'user',
    baseURL: 'api/users/'
    methods:
      getShows: ->
        "#{'pwong'}/shows"
