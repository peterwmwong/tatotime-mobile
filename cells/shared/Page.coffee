define
  render: (_,A)->
    [
      _ '.header',
        _ '.title'
      _ '.content'
      _ '.footer', 
          _ '.navbar',
            _ 'ul',
              _ 'li', _ '<a>', 'Watched'
              _ 'li', _ '<a>', 'Schedule'
              _ 'li', _ '<a>', 'Search'
    ]

  _renderHeader: (nodes)->
    if nodes and not @header
      @header = nodes
      $header = @$ '.header'
      $header.html ''
      for n in nodes
        $header.append n

  _renderContent: (nodes)->
    if nodes and not @content
      @content = nodes
      $content = @$ '.content'
      for n in nodes
        $content.append n
    return

  bind:
    afterRender: ->
      if @renderHeader
        @_renderHeader @renderHeader cell.renderHelper, (r2)=> @_renderHeader r2
      if @renderContent
        @_renderContent @renderContent cell.renderHelper, (r2)=> @_renderContent r2
      return false
