# Prevent app from being dragged beyond bounds
document.body.addEventListener 'touchmove', (e)-> e.preventDefault()
# Hide that pesky address bar on start and whenever the orientation changes
hideAddressBar = ->
  doScroll = 0
  setTimeout (hideIOSAddressBar = =>
    if ++doScroll is 1
      window.scrollTo 0,1
  ), 500
  $(window).bind 'resize', ->
    doScroll = 0
    hideIOSAddressBar()

$('body').attr 'class',
  if (ua = navigator.userAgent).match(/iPhone/i) or ua.match(/iPod/i) or ua.match(/iPad/i)
    if window.navigator.standalone
      'IOSFullScreen'
    else
      hideAddressBar()
      'IOS'
  else
    hideAddressBar()
    'ANDROID'


define [
  'AppConfig'
  './HashManager'
  './Model'
  './ContextModel'
  'cell!./Context'
  'cell!./ContextNavBar'
  'cell!./TitleBar'
], (AppConfig,HashManager,Model,ContextModel,Context,ContextNavBar,TitleBar)->

  # Cache of all previously loaded pages
  ctxCache = {}

  init: ->
    window.appmodel = @AppModel = new Model
      appConfig: AppConfig
      currentContext: undefined

  render: (_,A)-> [
    _ TitleBar, model: @AppModel
    _ '#content'
    _ ContextNavBar, model: @AppModel
  ]

  afterRender: ->

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