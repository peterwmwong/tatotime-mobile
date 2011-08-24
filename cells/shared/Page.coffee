define
  tag: -> "<div data-pagepath='#{@model.pagePath}'>"
  render: (_)-> [
    _ @options.cell, model: @model
  ]

  afterRender: ->
    scroller = new iScroll @el
    @model.bind 'refreshScroller', (refreshScroller = -> scroller.refresh())
    refreshScroller()
    @model.bind 'activate', (isBackNav)->
      if not isBackNav then scroller.scrollTo 0,0,0