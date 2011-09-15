define [
  'require'
  './Model'
  'cell!./Page'
], (require,Model,Page)->

  tag: -> "<div data-ctxid='#{@model.id}'>"

  afterRender: ->
    pageCache = {}
    curPage = null

    pageHistoryLength = @model.pageHistory.length
    @model.bindAndCall 'change:currentPageModel': ({cur,prev})=>
      isback = @model.pageHistory.length < pageHistoryLength
      pageHistoryLength = @model.pageHistory.length

      if isback and pageCell = pageCache[cur.hash]
        prevPageCell = pageCache[prev.hash]
        delete pageCache[prev.hash]
        prevPageCell.$el.bind 'webkitAnimationEnd', -> prevPageCell.$el.remove()
      else
        pageCell = pageCache[cur.hash] = new Page model: cur
      pageCell.$el.prependTo @$el

      pageInClass = 'Page animate ' +
        if prev
          rev = isback and '-reverse' or ''
          curPage.$el.attr 'class', 'Page animate headingOut' + rev
          curPage.model.trigger 'deactivate'
          'headingIn' + rev
        else
          'fadeIn'
      
      (curPage = pageCell).$el.attr 'class', pageInClass
      curPage.model.trigger
        type: 'activate'
        isback: isback
