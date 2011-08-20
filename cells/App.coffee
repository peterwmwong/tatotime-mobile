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
  $curPageCell = null

  hideAddressBar = ->
    window.scrollTo 0,1
    if window.pageYOffset <= 0
      setTimeout hideAddressBar, 10


  init: ->
    @myscroll = refresh: ->
    if window.navigator.standalone
      @$el.addClass 'appleHomeScreenApp'

  changePage: ($page)->
    $page
      .toggle(true)
      .trigger('change')
    $curPageCell?.toggle false
    $curPageCell = $page
    setTimeout (=> @myscroll.refresh()), 100

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just $.mobile.changePage to that node.
  ###
  loadAndChangePage: (fullpath,pagecellpath,data)->
    if hist[0] isnt fullpath
      options =
        transition: hist.length and 'slide' or 'fade'
        reverse: not hist.addOrRewind fullpath


      if ($pagecell = pageCellRegistry[pagecellpath])?
        @changePage $pagecell

      else
        require ["cell!#{pagecellpath}"], (pagecell)=>
          ($pagecell = pageCellRegistry[pagecellpath] = (new pagecell(data).$el))
            .prependTo(@$content)
            .attr 'data-cell-page', pagecellpath
          @changePage $pagecell

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
  
  render: (_)-> [
    _ '#header', _ '.title', 'TITLE'
    _ '#content', _ 'div'
    _ '#footer',
      _ 'ul',
        _ 'li', _ 'a', 'Watch'
        _ 'li', _ 'a', 'Schedule'
        _ 'li', _ 'a', 'Search'
  ]

  bind:
    afterRender: ->
      hideAddressBar()
      @$content = @$ '#content'
      @myscroll = new iScroll @$content[0]
      $(window).bind 'hashchange', => @syncPageToHash()
      @syncPageToHash()
