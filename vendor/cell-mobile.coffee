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
        options =
          transition: hist.length and 'slide' or 'fade'
          reverse: not hist.addOrRewind fullpath

        if (pagecell = pageCellRegistry[pagecellpath])?
          $.mobile.changePage pagecell.$el, options
          deactiveJQMBtnClass()

        else
          require baseUrl: baseurl, ["cell!#{pagecellpath}"], (pagecell)->
            pagecell = pageCellRegistry[pagecellpath] = new pagecell(data)
            ($el = pagecell.$el).attr 'data-cell-page', pagecellpath
            $body.prepend $el
            $.mobile.changePage $el, options
            deactiveJQMBtnClass()

      return
    
  $ ->
    $body = $ 'body'
    $(window).bind 'hashchange', syncPageToHash = ->
      [cellpath,jsondata] = (fullpath = location.hash.slice(3)).split '?'
      data = {}
      if jsondata
        for kv in jsondata.split '&'
          [k,v] = kv.split '='
          data[k] = v
      loadAndChangePage fullpath, cellpath or 'App', data
      return
    syncPageToHash()
    return