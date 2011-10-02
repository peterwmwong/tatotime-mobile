define [
  'require'
  './Nav'
], (require, Nav)->

  tag: -> "<div data-cellpath='#{@model.page}'>"

  render: (_,A)->
    require ["cell!#{@model.page}"], (page)=> A [
      _ page, model: @model
    ]

  afterRender: ->
    # This shit is to compensate for Android not supporting
    # CSS3 animation-fill-mode: forwards
    active = true

    @model.bind 'deactivate': =>
      active = false

    @model.bind 'activate': =>
      active = true
      @$el.css 'visibility', 'visible'

    @$el.bind 'webkitAnimationEnd', =>
      if not active
        @$el.css 'visibility', 'hidden'

    scroller = new iScroll @el
    @model.bindAndCall 'refreshScroller': -> scroller.refresh()

  on:
    "click *[data-navto]": ({target})->
      Nav.goTo $(target)
        .closest('[data-navto]')
        .data('navto')