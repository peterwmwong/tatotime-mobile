define [
  './Model'
], (Model)->
  tag: -> "<div data-pagepath='#{@options.pagepath}'>"
  init: ->
    @model = new Model
      pagepath: @options.cellpath
      data: @options.data

  render: (_)-> [
    _ @options.cell, model: @model
  ]

  afterRender: ->
    scroller = new iScroll @el
    @model.bind 'refreshScroller', (refreshScroller = -> scroller.refresh())
    refreshScroller()
    @model.bind 'activate', (isBackNav)->
      if not isBackNav then scroller.scrollTo 0,0,0