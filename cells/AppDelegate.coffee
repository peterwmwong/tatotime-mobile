define [
  'cell!pages/schedule/Schedule' # Preload front pages
], ->
  init: ->
    @model.tabs = 
      Schedule:
        defaultPagePath: 'pages/schedule/Schedule'
      Watch:
        defaultPagePath: 'pages/watch/Watch'
      Search:
        defaultPagePath: 'pages/watch/Watch'
    @model.defaultTab = 'Schedule'