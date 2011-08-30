define ->
  rendertabs = (_,tabs)->
    for tabid,{text} of tabs
      _ "<li data-tabid='#{tabid}'>", text or tabid

  tag: '<ul>'

  render: (_,A)->
    if tabs = @model.tabs
      rendertabs _, tabs
    else
      @model.bind 'change:tabs', (tabs)->
        A renderTabs tabs
    
  on:
    'click li': ({target})->
      $('li.active').removeClass 'active'
      @model.set 'currentTab',
        $(target)
          .addClass('active')
          .data('tabid')
