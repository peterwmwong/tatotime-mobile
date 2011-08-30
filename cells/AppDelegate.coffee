define [
  'cell!pages/watch/Watch' # Preload front pages
], ->
  init: ->
    @model.tabs = 
      Schedule:
        defaultPagePath: 'pages/watch/Watch'
      Watch:
        defaultPagePath: 'pages/watch/Watch'
      Search:
        defaultPagePath: 'pages/watch/Watch'
    @model.defaultTab = 'Schedule'