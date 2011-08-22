define
  tag: '<ul>'

  render: (_,A)->
    if list = @options.list
      for {text,link} in list
        _ "<li data-dest='#{link}'>", text
  
  on:
    'click li': (e)->
      $('li.active').removeClass 'active'
      window.location.hash =
        $(e.target)
          .addClass('active')
          .data('dest')