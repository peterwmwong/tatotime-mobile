do->
  ###
  Helpers
  ###
  L = (args...)-> console.log args...

  ###
  Effectively, deactivate jquery-mobile navigation model.
  ###
  $body = null;

  $(document).bind "mobileinit", ->
    $.extend $.mobile,
      hashListeningEnabled: false
      ajaxEnabled: false
    return

  baseurl = "cells/"

  deactiveJQMBtnClass = ->
    setTimeout (->
      $(".#{$.mobile.activeBtnClass}").removeClass $.mobile.activeBtnClass
    ), 500


  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just $.mobile.changePage to that node.
  ###
  loadAndChangePage = do->
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

    ###
    1) Render page cell to body
    2) Change page to page cell node
    3) Tell jquery-mobile page loading is done
    ###
    (fullpath,pagecellpath,data)->

      if hist[0] isnt fullpath
        transition = (hist.length is 0) and 'fade' or 'slide'
        isReverse = not hist.addOrRewind fullpath

        if (pagecell = pageCellRegistry[pagecellpath])?
          $.mobile.changePage pagecell.$el,
            transition: transition
            reverse: isReverse
          deactiveJQMBtnClass()

        else
          require baseUrl: baseurl, ["cell!#{pagecellpath}"], (pagecell)->
            pagecell = pageCellRegistry[pagecellpath] = new pagecell(data)
            ($el = pagecell.$el).attr 'data-cell-page', pagecellpath
            $body.prepend $el
            $.mobile.changePage $el,
              transition: transition
              reverse: isReverse
            deactiveJQMBtnClass()

      return
    
  $ ->
    $body = $ 'body'
    $(window).bind 'hashchange', syncPageToHash = ->
      [cellpath,jsondata] = (fullpath = location.hash.slice(3)).split '?'
      data = {}
      if jsondata and kvs = jsondata.split '&'
        for kv in kvs
          [k,v] = kv.split '='
          data[k] = v
      loadAndChangePage fullpath, cellpath or 'App', data
      return
    syncPageToHash()
    return