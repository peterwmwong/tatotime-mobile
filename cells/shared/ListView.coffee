define ->
  renderList = (list)->
    _ = cell.renderHelper
    for {text,link} in list
      _ 'li',
        _ 'a', href: link, text

  'render <ul data-role="listview">': (_,A)->
    {list,getList} = @options
    if list then renderList list
    else if getList
      getList (list)=> A renderList list
    return

  bind:
    afterRender: ->
      try @$el.listview 'refresh'
      return false
