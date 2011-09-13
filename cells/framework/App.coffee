define [
  'AppConfig'
  'Services'
  './HashManager'
  './Model'
  './ContextModel'
  'cell!./Context'
  'cell!./ContextNavBar'
  'cell!./TitleBar'
], (AppConfig,S,HashManager,Model,ContextModel,Context,ContextNavBar,TitleBar)->

  # Prevent app from being dragged byonds it's limits on iOS
  if S.isIOS
    document.body.addEventListener 'touchmove', (e)-> e.preventDefault()

  # Cache of all previously loaded pages
  ctxCache = {}

  init: ->
    if S.isIOSFullScreen
      @options.class = 'IOSFullScreenApp'
      
    window.appmodel = @AppModel = new Model
      appConfig: AppConfig
      currentContext: undefined

  render: (_,A)-> [
    _ TitleBar, model: @AppModel
    _ '#content'
    _ ContextNavBar, model: @AppModel
  ]

  afterRender: ->
    # Hide that pesky iOS address bar on start and whenever
    # the orientation changes
    if S.isIOS and not S.isIOSFullScreen

      # Hides iOS mobile safari address bar (scroll hack)
      setTimeout (hideIOSAddressBar = ->
        window.scrollTo 0,1
        if window.pageYOffset <= 0
          setTimeout hideIOSAddressBar, 50
      ), 100
      $(window).bind 'resize', hideIOSAddressBar

    # Cache content jQuery object, for appending Contexts to
    $content = @$ '#content'

    hashmgr = new HashManager
      appConfig: AppConfig
      hashDelegate:
        get: -> window.location.hash
        onChange: (cb)->
          $(window).bind 'hashchange', cb
    
    hashmgr.bindAndCall 'change:current': ({cur})=>
      if cur.context isnt @AppModel.currentContext?.id
        if not (ctxCell = ctxCache[cur.context])
          ctxCell = ctxCache[cur.context] = new Context
            model: ctxModel = new ContextModel
              id: cur.context
              defaultPagePath: AppConfig.contexts[cur.context].defaultPagePath
              initialHash: cur
              hashManager: hashmgr
          $content.append ctxCell.$el
        
        if ctxCell
          @AppModel.set currentContext: ctxCell.model
          @$('#content > .activeTab').removeClass 'activeTab'
          ctxCell.$el.toggleClass 'activeTab', true
        else
          console?.log? "Could not switch to context = '#{cur.context}'"
      return

    @AppModel.bind switchContext: (ctxid)=>
      window.location.hash =
        hashmgr.toHash
          context: ctxid
          page: (pmodel = ctxCache[cur.context].model.currentPageModel)?.page
          data: pmodel?.data

    @AppModel.bind goback: =>
      hash = @AppModel.currentContext?.pageHistory?[1]?.hash
      if hash?
        window.location.hash = hash