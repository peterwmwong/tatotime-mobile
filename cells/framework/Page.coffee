define [
  'require'
  './Model'
], (require, Model)->

  tag: -> "<div data-cellpath='#{@model.page}'>"

  render: (_,A)->
    require ["cell!#{@model.page}"], (page)=> A [
      _ page, model: @model
    ]

  afterRender: ->
    scroller = new iScroll @el
    @model.bindAndCall 'refreshScroller': -> scroller.refresh()
    @model.bind 'activate': ({data})-> not data and scroller.scrollTo 0,0,0