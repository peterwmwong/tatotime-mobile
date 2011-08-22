define ->
  _ = cell::$R
  renderList = (list)->
    for {text,link} in list
      _ "<li data-dest='#{link}'>", text

  tag: '<ul>'
  render: (_,A)->
    {list,getList} = @options
    if list then renderList list
    else if getList
      getList (list)=> A renderList list
    return
  
  on:
    'click li': (e)->
      $('li.active').removeClass 'active'
      window.location.hash =
        $(e.target)
          .addClass('active')
          .data('dest')