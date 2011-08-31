define
  tag: '<ul>'
  
  render: (_,A)->
    if list = @options.list
      for {text,link,dividerText} in list when text or dividerText
        if text
          _ "<li data-dest='#{link}'>", text
        else # dividerText
          _ "li.divider", divderText
  
  on:
    'click li': ({target})->
      $('li.active').removeClass 'active'
      window.location.hash =
        $(target)
          .addClass('active')
          .data('dest')