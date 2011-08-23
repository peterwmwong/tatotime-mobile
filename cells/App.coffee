define [
  'require'
  'Services'
  'shared/History'
  'shared/Model'
  'cell!shared/Page'
  'cell!pages/watch/Watch' # Preload front page
], (require,S,History,Model,Page)->
  document.body.addEventListener 'touchmove', (e)-> e.preventDefault()

  # Cache of all previously loaded pages
  pageCache = {}

  # Current page
  curPage = null
  lastChangePageWasReverse = false

  # Hides iOS mobile safari address bar (scroll hack)
  hideIOSAddressBar = ->
    window.scrollTo 0,1
    if window.pageYOffset <= 0
      setTimeout hideIOSAddressBar, 50

  changeTitle: (newTitle)->
    rev = lastChangePageWasReverse and '-reverse' or ''
    if title = @$title.html()
      @$prevtitle
        .html(@$title.html())
        .attr('class', 'headingOut'+rev)

    if newTitle
      @$title
        .html(newTitle)
        .attr('class', 'headingIn'+rev)
    else
      @$title.html ''

  # Animates and changes currently visible page
  changePage: (page, isReverse)->
    lastChangePageWasReverse = isReverse
    pageInClass =
      if curPage
        rev = isReverse and '-reverse' or ''
        curPage.$el.attr 'class', 'Page headingOut' + rev
        curPage.model.trigger 'deactivate'
        'Page headingIn' + rev
      else
        'Page fadeIn'

    (curPage = page).$el.attr 'class', pageInClass
    curPage.model.trigger 'activate', isReverse
    
    @changeTitle curPage.model.title

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just change to it.
  ###
  loadAndChangePage: (fullpath,pagepath,data)->
    if History[0] isnt fullpath
      isReverse = not (History.addOrRewind fullpath)
      @$('#backbutton').css 'visibility', (History.length > 1) and 'visible' or 'hidden'

      if (page = pageCache[pagepath])?
        page.model.set 'data', data
        @changePage page, isReverse

      # Load new page cell
      else
        require ["cell!#{pagepath}"], (pagecell)=>
          page = pageCache[pagepath] =
            new Page
              cell: pagecell
              model: new Model(pagePath: pagepath, data: data)
          page.$el.appendTo @$content
          page.model.bind 'change:title', (title)=>
            if curPage.model.pagePath is pagepath
              @changeTitle curPage.model.title
          @changePage page

    return

  ###
  Location hash change handler
  The hash determines:
    1) which page we're on
    2) data passed to the page
  ###
  syncPageToHash: ->
    [cellpath,jsondata] = (fullpath = location.hash.slice(3)).split '?'
    data = {}
    if jsondata
      for kv in jsondata.split '&'
        [k,v] = kv.split '='
        data[k] = v
    @loadAndChangePage fullpath, (cellpath or 'pages/watch/Watch'), data
    return false
  
  init: -> 
    if S.isIOSFullScreen
      @options.class = 'IOSFullScreenApp'

  render: (_)-> [
    _ '#header',
      _ '#backbutton', _ 'span', 'Back'
      _ '#title', ' '
      _ '#prevtitle', ' '
      _ '#forwardbutton', _ 'span', 'Do It'
    _ '#content'
    _ '#footer',
      _ 'ul',
        _ 'li', 'Watch'
        _ 'li', 'Schedule'
        _ 'li', 'Search'
  ]

  afterRender: ->
    # Hide that pesky iOS address bar on start and whenever
    # the orientation changes
    if S.isIOS and not S.isIOSFullScreen
      setTimeout hideIOSAddressBar, 50
      $(window).bind 'resize', hideIOSAddressBar

    # Cache content jQuery object, for appending pages to
    @$content = @$ '#content'
    @$title = @$ '#title'
    @$title.bind 'webkitAnimationEnd', => @$title.attr 'class', ''
    @$prevtitle = @$ '#prevtitle'
    @$prevtitle.bind 'webkitAnimationEnd', => @$prevtitle.attr 'class', ''

    # Load up the proper page on start and whenever we
    # navigate somewhere
    $(window).bind 'hashchange', => @syncPageToHash()
    @syncPageToHash()

  on:
    'click #backbutton': ->
      if History.length > 1
        window.location.hash = History[1]