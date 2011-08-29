define
  init: ->
    @model.tabs = 
      Schedule:
        defaultPagePath: 'pages/watch/Watch'
      Watch:
        defaultPagePath: 'pages/watch/Watch'
      Search:
        defaultPagePath: 'pages/watch/Watch'
    @model.defaultTab = 'Schedule'