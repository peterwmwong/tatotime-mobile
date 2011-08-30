define [
  'require'
  'Services'
  './History'
  './Model'
  'cell!./Tab'
  'cell!./TabNavBar'
  'cell!pages/watch/Watch' # TODO - Remove, find a better way to preload front page
], (require,S,History,Model,Tab,TabNavBar)->

  # Prevent app from being dragged byonds it's limits on iOS
  if S.isIOS
    document.body.addEventListener 'touchmove', (e)-> e.preventDefault()

  AppModel = new Model currentTab: undefined

  # Cache of all previously loaded pages
  tabCache = {}

  # Current page
  curTab = null

  changeTitle: (newTitle,wasLastBack)->
    rev = wasLastBack and '-reverse' or ''
    if title = @$title.html()
      @$prevtitle
        .html(@$title.html())
        .attr('class', 'headingOut'+rev)

    if newTitle
      @$title
        .html(newTitle)
        .attr('class', 'headingIn'+rev)
    else
      @$title.html ''

  # Animates and changes currently visible page
  changeTab: (tabid)->
    tab = tabCache[tabid]
    if not tab
      tab = tabCache[tabid] = new Tab
        defaultCellPath: AppModel.tabs[tabid].defaultPagePath
        model: new Model
          id: tabid
          title: 'Loading...'
      tab.model.bind 'change:title', (newTitle)=>
        @changeTitle newTitle, tab.history.wasLastBack
      @changeTitle tab.model.title
      @$content.append tab.$el

    AppModel.set 'currentTab', tabid
    @$('#content > .activeTab').removeClass 'activeTab'
    tab.$el.toggleClass 'activeTab', true
    
  init: ->
    if S.isIOSFullScreen
      @options.class = 'IOSFullScreenApp'

  render: (_,A)->
    require ['AppDelegate'], (@appDelegate)=>
      @appDelegate.model = AppModel
      @appDelegate.init?()
      A [
        _ '#header',
          _ '#backbutton', _ 'span', 'Back'
          _ '#title', ' '
          _ '#prevtitle', ' '
          _ '#forwardbutton', _ 'span', 'Do It'
        _ '#content'
        _ '#footer',
          _  TabNavBar, model: AppModel
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

    # Cache Title and Previous Title (for title "slide out" animation)
    @$title = @$ '#title'
    @$title.bind 'webkitAnimationEnd', => @$title.attr 'class', ''
    @$prevtitle = @$ '#prevtitle'
    @$prevtitle.bind 'webkitAnimationEnd', => @$prevtitle.attr 'class', ''

    # Load first/default Tab
    @changeTab AppModel.defaultTab

  on:
    'click #backbutton': -> tabCache[AppModel.currentTab]?.history.goBack()