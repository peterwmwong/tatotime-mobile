define
  render: (_,A)-> [
    _ '#backbutton', _ 'span', 'Back'
    _ '#titles',
      _ '#title'
      _ '#prevtitle'
    _ '#gobutton', _ 'span', 'Do It'
  ]

  afterRender: ->
    # Cache Title and Previous Title (for title "slide out" animation)
    animating = false
    $backbutton = @$ '#backbutton'
    $backbuttonText = @$ '#backbutton > span'
    $title = @$ '#title'
    $prevtitle = @$ '#prevtitle'
    pageHistoryLengthMap = {}

    $title.bind 'webkitAnimationEnd', ->
      $title.attr 'class', ''
      $prevtitle.attr 'class', ''
      animating = false

    @model.bindAndCall 'change:currentContext.currentPageModel.title': ({cur})=>
      prevTitle = $title.html()
      $title.html cur or ''

      if not animating and (curCtx = @model.currentContext)
        pageHistory = curCtx.pageHistory

        $backbutton.css 'visibility', (pageHistory.length > 1) and 'visible' or 'hidden'

        prevHistoryLength = (pageHistoryLengthMap[curCtx.id] ?= pageHistory.length)

        # TODO: should lastNavWasBack be in currentContext
        rev = prevHistoryLength > pageHistory.length and '-reverse' or ''
        pageHistoryLengthMap[curCtx.id] = pageHistory.length

        if e = pageHistory[1]
          $backbuttonText.html e.title
        if prevTitle
          $prevtitle
            .html(prevTitle)
            .attr('class', 'animate headingOutFade'+rev)

        $title.attr 'class', 'animate headingInFade'+rev
        animating = true

  on:
    'click #backbutton': -> @model.trigger 'goback'