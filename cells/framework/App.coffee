define [
  'AppDelegate'
  'Services'
  './Model'
  'cell!./Tab'
  'cell!./TabNavBar'
  'cell!./TitleBar'
], (AppDelegate,S,Model,Tab,TabNavBar,TitleBar)->

  # Prevent app from being dragged byonds it's limits on iOS
  if S.isIOS
    document.body.addEventListener 'touchmove', (e)-> e.preventDefault()

  AppModel = new Model
    currentHistory: undefined
    currentTab: undefined

  # Cache of all previously loaded pages
  tabCache = {}

  # Current page
  curTab = null

  # Animates and changes currently visible page
  changeTab: (tabid)->
    debugger
    tab = tabCache[tabid]
    if not tab
      tab = tabCache[tabid] = new Tab
        defaultCellPath: AppModel.tabs[tabid].defaultPagePath
        model: new Model {id: tabid}
      @$content.append tab.$el

    AppModel.set currentTab: tabid
    AppModel.set currentHistory: tab.history
    @$('#content > .activeTab').removeClass 'activeTab'
    tab.$el.toggleClass 'activeTab', true
    
  init: ->
    if S.isIOSFullScreen
      @options.class = 'IOSFullScreenApp'

    AppDelegate.model = AppModel
    AppDelegate.init?()

  render: (_,A)-> [
    _ TitleBar, model: AppModel
    _ '#content'
    _ TabNavBar, model: AppModel
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

    # Cache content jQuery object, for appending pages to
    @$content = @$ '#content'

    # Load first/default Tab
    @changeTab AppModel.defaultTab

    AppModel.bind 'goback', -> tabCache[AppModel.currentTab]?.history.goBack()
    AppModel.bind 'change:currentTab', (tab)=> @changeTab tab
