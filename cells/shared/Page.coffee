define
  tag: -> "<div data-pagepath='#{@model.pagePath}'>"
  render: (_)-> [
    _ @options.cell, model: @model
  ]

  afterRender: ->
    scroller = new iScroll @el
    refreshScroller = ->
      setTimeout (-> scroller.refresh()), 500
    refreshScroller()
    @model.bind 'change:data', refreshScroller