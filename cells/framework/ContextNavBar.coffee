define

  tag: '<ul>'

  render: (_,A)-> [
    for ctxid,{text} of @model.appConfig.contexts
      _ "<li data-ctxid='#{ctxid}'>", text or ctxid
  ]
    
  on:
    'click li': ({target})->
      $('li.active').removeClass 'active'
      @model.set currentContext:
        $(target)
          .addClass('active')
          .data('ctxid')
