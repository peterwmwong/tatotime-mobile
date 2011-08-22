define [
  'require'
  'Services'
  'cell!pages/watch/Watch'
], (require,S)->

  # Keeps track of page history
  hist = []

  # Adds to the history or rewinds if "going back" is detected
  hist.addOrRewind = (fullpath)->
    if (i = @indexOf fullpath) is -1
      @unshift fullpath
      true
    else
      @splice 0, i
      false

  # Finds index of page in history, -1 if not history
  hist.indexOf = (path)->
    for p,i in this when p is path
      return i
    return -1

  # Cache of all previously loaded pages
  pageCellRegistry = {}

  # Scroller (iScroll) for current page
  curScroller = null

  # Hides iOS mobile safari address bar (scroll hack)
  DEBUG_ONLY_iterCount = 0
  hideIOSAddressBar = ->
    $('#header .title').html DEBUG_ONLY_iterCount++
    window.scrollTo 0,1
    if window.pageYOffset <= 0
      setTimeout hideIOSAddressBar, 50

  # Create iScroll for a new page
  makeScroller = (pagecell, pagecellpath)->
    s = document.createElement 'div'
    s.appendChild pagecell.el
    scroller = new iScroll s
    scroller.pagecell = pagecell
    s.className = 'scroller'
    (scroller.$node = $(s)).attr 'data-cell-page', pagecellpath
    scroller

  changePage = (scroller, data, isReverse)->
    if curScroller
      curScroller.$node.attr 'class', 'scroller headingOut' + (isReverse and '-reverse' or '')
      (curScroller = scroller).$node.attr 'class', 'scroller headingIn' + (isReverse and '-reverse' or '')
    else
      (curScroller = scroller).$node.attr 'class', 'scroller fadeIn'
    setTimeout (-> scroller.refresh()), 500

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just change to it.
  ###
  loadAndChangePage: (fullpath,pagecellpath,data)->
    if hist[0] isnt fullpath
      isReverse = not (hist.addOrRewind fullpath)

      if (scroller = pageCellRegistry[pagecellpath])?
        #scroller.pagecell.options = data
        #scroller.pagecell.update()
        changePage scroller, data, isReverse

      # Load new page cell
      else
        require ["cell!#{pagecellpath}"], (pagecell)=>
          scroller = pageCellRegistry[pagecellpath] = makeScroller(new pagecell(data), pagecellpath)
          scroller.$node.appendTo @$content
          changePage scroller, data

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
    @loadAndChangePage fullpath, cellpath or 'pages/watch/Watch', data
    return false
  
  init: -> 
    if S.isIOSFullScreen
      @options.class = 'IOSFullScreenApp'

  render: (_)-> [
    _ '#header', _ '.title', 'TITLE'
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

    # Load up the proper page on start and whenever we
    # navigate somewhere
    $(window).bind 'hashchange', => @syncPageToHash()
    @syncPageToHash()