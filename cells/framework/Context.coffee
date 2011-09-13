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
      pagePath = cur.page
      if cachedPage = pageCache[pagePath]
        #TODO stuff in bindAndCall
        cachedPage.model.set data: cur.data

      # Load new page cell
      else
        cachedPage = pageCache[pagePath] = new Page model: cur
        cachedPage.$el.appendTo @$el

      pageInClass =
        if prev
          rev = @model.pageHistory.length < pageHistoryLength and '-reverse' or ''
          curPage.$el.attr 'class', 'Page headingOut' + rev
          curPage.model.trigger 'deactivate'
          'Page headingIn' + rev
        else
          'Page fadeIn'
      pageHistoryLength = @model.pageHistory.length

      (curPage = cachedPage).$el.attr 'class', pageInClass
      curPage.model.trigger 'activate', @model.pageHistory.wasLastBack
