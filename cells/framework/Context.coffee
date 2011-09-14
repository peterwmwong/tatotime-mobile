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
        prevPageCell.$el.remove()
        delete pageCache[prev.hash]
      else
        pageCell = pageCache[cur.hash] = new Page model: cur
      pageCell.$el.appendTo @$el

      pageInClass =
        if prev
          rev = isback and '-reverse' or ''
          curPage.$el.attr 'class', 'Page headingOut' + rev
          curPage.model.trigger 'deactivate'
          'Page headingIn' + rev
        else
          'Page fadeIn'

      (curPage = pageCell).$el.attr 'class', pageInClass
      curPage.model.trigger
        type: 'activate'
        isback: isback
