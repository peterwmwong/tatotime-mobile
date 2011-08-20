define ->
  _ = cell.renderHelper

  renderList = (list)->
    for {text,link} in list
      _ 'li',
        _ 'a', href: link, text

  'render <ul>': (_,A)->
    {list,getList} = @options
    if list then renderList list
    else if getList
      getList (list)=> A renderList list
    return
  
  bind:
    'click a': (e)->
      $('li.active').removeClass 'active'
      $(e.target).closest('li').addClass 'active'