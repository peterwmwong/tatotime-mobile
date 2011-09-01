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
    model = @model
    $backbutton = @$ '#backbutton'
    $backbuttonText = @$ '#backbutton > span'
    $title = @$ '#title'
    $prevtitle = @$ '#prevtitle'
    
    $title.bind 'webkitAnimationEnd', ->
      $title.attr 'class', ''
      $prevtitle.attr 'class', ''
      animating = false

    handleTitleChange = (title)-> $title.html title or ''
    handleCurrentChange = (cur)->
      prevTitle = $title.html()

      cur.bind 'change:title', handleTitleChange
      handleTitleChange cur.title

      if not animating
        curHist = model.currentHistory
        hasHistory = curHist.length() > 1

        $backbutton.css 'visibility', hasHistory and 'visible' or 'hidden'
        rev = curHist.wasLastBack and '-reverse' or ''

        if e = curHist._hist[1]?
          console.log curHist
          $backbuttonText.html e.title
        if prevTitle
          $prevtitle
            .html(prevTitle)
            .attr('class', 'headingOut'+rev)

        $title.attr 'class', 'headingIn'+rev
        animating = true

    model.bind 'change:currentHistory', handleCurrentHistoryChange = (curHist)->
      if curHist
        curHist.bind 'change:current', handleCurrentChange
        handleCurrentChange curHist.current
    
    handleCurrentHistoryChange model.currentHistory

  on:
    'click #backbutton': -> @model.trigger 'goback'