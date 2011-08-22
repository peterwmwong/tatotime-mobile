define [
  'data/JSONP'
],({JSONPService})->
  
  new JSONPService 'users',
    baseURL: 'api/users/'
    methods:
      getShows: ->
        "#{'pwong'}/shows"
