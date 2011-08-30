define [
  'require'
  './History'
  'cell!./Page'
], (require,History,Page)->

  init: ->
    # Cache of all previously loaded pages
    @pageCache = {}

    # Current page
    @curPage = null

    @history = new History defaultCellPath: @options.defaultCellPath

  # Animates and changes currently visible page
  changePage: (page)->
    pageInClass =
      if @curPage
        rev = @history.wasLastBack and '-reverse' or ''
        @curPage.$el.attr 'class', 'Page headingOut' + rev
        @curPage.model.trigger 'deactivate'
        'Page headingIn' + rev
      else
        'Page fadeIn'

    (@curPage = page).$el.attr 'class', pageInClass
    @curPage.model.trigger 'activate', @history.wasLastBack
    
    @model.set 'title', @curPage.model.title

  ###
  Loads and renders the specified Page Cell if not already loaded.
  If already previously loaded, just change to it.
  ###
  loadAndChangePage: ->
    {fullpath,cellpath,data} = @history.current
    @$('#backbutton').css 'visibility', (@history.length() > 1) and 'visible' or 'hidden'

    if (page = @pageCache[cellpath])?
      page.model.set 'data', data
      page.model.set 'fullpath', fullpath
      @changePage page

    # Load new page cell
    else
      require ["cell!#{cellpath}"], (pagecell)=>
        page = @pageCache[cellpath] =
          new Page
            fullpath: fullpath
            cell: pagecell
            cellpath: cellpath
            data: data
        page.$el.appendTo @$el
        page.model.bind 'change:title', (title)=>
          if @curPage.model.fullpath is @history.current.fullpath
            @model.set 'title', @curPage.model.title
        @changePage page

    return

  afterRender: ->
    # Load up the proper page on start and whenever we
    # navigate somewhere
    @history.bind 'change:current', (cur)=> @loadAndChangePage()
    @loadAndChangePage()