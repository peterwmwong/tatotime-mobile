define [
  'require'
  'Services'
  'cell!pages/watch/Watch'
], (require,S)->

  hist = []
  hist.addOrRewind = (fullpath)->
    if (i = @indexOf fullpath) is -1
      @unshift fullpath
      true
    else
      @splice 0, i
      false
  hist.indexOf = (path)->
    for p,i in this when p is path
      return i
    return -1
  pageCellRegistry = {}
  curScroller = null

  hideIOSAddressBar = ->
    window.scrollTo 0,1
    if window.pageYOffset <= 0
      setTimeout hideIOSAddressBar, 10

  makeScroller = (pagecell, pagecellpath)->
    s = document.createElement 'div'
    s.appendChild pagecell.el
    scroller = new iScroll s
    scroller.pagecell = pagecell
    s.className = 'scroller'
    (scroller.$node = $(s)).attr 'data-cell-page', pagecellpath
    scroller

  changePage = (scroller, data)->
    curScroller and curScroller.$node.css 'display','none'
    (curScroller = scroller).$node.css 'display','block'
    setTimeout (-> scroller.refresh()), 250

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just $.mobile.changePage to that node.
  ###
  loadAndChangePage: (fullpath,pagecellpath,data)->
    if hist[0] isnt fullpath
      hist.addOrRewind fullpath

      if (scroller = pageCellRegistry[pagecellpath])?
        #scroller.pagecell.options = data
        #scroller.pagecell.update()
        changePage scroller, data

      else
        require ["cell!#{pagecellpath}"], (pagecell)=>
          scroller = pageCellRegistry[pagecellpath] = makeScroller(new pagecell(data), pagecellpath)
          scroller.$node.appendTo @$content
          changePage scroller, data

    return

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
    if window.navigator.standalone
      @options.class = 'appleHomeScreenApp'

  render: (_)-> [
    _ '#header', _ '.title', 'TITLE'
    _ '#content'
    _ '#footer',
      _ 'ul',
        _ '<li><a>', 'Watch'
        _ '<li><a>', 'Schedule'
        _ '<li><a>', 'Search'
  ]

  afterRender: ->
    S.isIOS and hideIOSAddressBar()
    @$content = @$ '#content'
    $(window).bind 'hashchange', => @syncPageToHash()
    @syncPageToHash()