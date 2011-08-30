define
  changeTitle: (title)->
    @$backbutton.css 'visibility', (@model.currentHistory?.length() > 1) and 'visible' or 'hidden'

    rev = @model.currentHistory?.wasLastBack and '-reverse' or ''
    if @$title.html()
      @$prevtitle
        .html(@$title.html())
        .attr('class', 'headingOut'+rev)

    if title
      @$title
        .html(title)
        .attr('class', 'headingIn'+rev)
    else
      @$title.html ''

  render: (_,A)-> [
    _ '#backbutton', _ 'span', 'Back'
    _ '#title', @model.currentTitle or ' '
    _ '#prevtitle', ' '
    _ '#forwardbutton', _ 'span', 'Do It'
  ]

  afterRender: ->
    # Cache Title and Previous Title (for title "slide out" animation)
    @$backbutton = @$ '#backbutton'
    @$title = @$ '#title'
    @$title.bind 'webkitAnimationEnd', => @$title.attr 'class', ''
    @$prevtitle = @$ '#prevtitle'
    @$prevtitle.bind 'webkitAnimationEnd', => @$prevtitle.attr 'class', ''

    @model.bind 'change:currentTitle', (title)=> @changeTitle title

  on:
    'click #backbutton': -> @model.trigger 'goback'