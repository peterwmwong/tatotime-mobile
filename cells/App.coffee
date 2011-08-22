define [
  'require'
  'Services'
  'shared/History'
  'shared/PageService'
  'cell!pages/watch/Watch'
], (require,S,History,PageService)->

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
  makeScroller = (pagecell, pageService)->
    s = document.createElement 'div'
    s.appendChild pagecell.el
    scroller = new iScroll s
    scroller.pagecell = pagecell
    scroller.pageService = pageService
    s.className = 'scroller'
    (scroller.$node = $(s)).attr 'data-cell-page', pageService.pagecellpath
    scroller


  changePage: (scroller, data, isReverse)->
    if curScroller
      curScroller.$node.attr 'class', 'scroller headingOut' + (isReverse and '-reverse' or '')
      (curScroller = scroller).$node.attr 'class', 'scroller headingIn' + (isReverse and '-reverse' or '')
    else
      (curScroller = scroller).$node.attr 'class', 'scroller fadeIn'

    @$title.html curScroller.pageService.getTitle() or "&nbsp;"

    setTimeout (-> scroller.refresh()), 500


  makePageService: (pagecellpath)->
    ps = new PageService pagecellpath
    ps.bind 'titleChange', ({title})=>
      if curScroller?.pageService.pagecellpath is pagecellpath
        @$title.html title
    ps

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just change to it.
  ###
  loadAndChangePage: (fullpath,pagecellpath,data)->
    if History[0] isnt fullpath
      isReverse = not (History.addOrRewind fullpath)

      if (scroller = pageCellRegistry[pagecellpath])?
        data.pageService = scroller.pageService
        scroller.pagecell.update? data
        @changePage scroller, data, isReverse

      # Load new page cell
      else
        require ["cell!#{pagecellpath}"], (pagecell)=>
          data.pageService = @makePageService pagecellpath
          scroller = pageCellRegistry[pagecellpath] = makeScroller new pagecell(data), data.pageService
          scroller.$node.appendTo @$content
          @changePage scroller, data

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
    _ '#header', _ '.title', '&nbsp;'
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
    @$title = @$ '#header > .title'

    # Load up the proper page on start and whenever we
    # navigate somewhere
    $(window).bind 'hashchange', => @syncPageToHash()
    @syncPageToHash()