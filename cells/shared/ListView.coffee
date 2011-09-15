define
  tag: '<ul>'
  
  render: (_,A)->
    if list = @options.list
      for {text,link,dividerText} in list when text or dividerText
        if text
          _ "<li data-dest='#{link}'>",
            _ 'div'
            text
        else # dividerText
          _ "li.divider", dividerText
  
  on:
    'resetActive': -> @$('li.active').removeClass('active').addClass('deactive')
    'webkitAnimationEnd li > div': -> @$('li.deactive').removeClass 'deactive'
    'click li': ({target})->
      @$('li.active').removeClass 'active'
      window.location.hash =
        $(target)
          .closest('li')
          .addClass('active')
          .data('dest')