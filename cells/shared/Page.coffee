define
  'render <div data-role="page">': (_,A)->
    [
      _ '<div data-role="header">',
          _ '<h2>', "sldkfj"
      _ '<div data-role="content">'
      _ '<div data-role="footer" data-position="fixed" data-id="footer">', 
          _ '<div data-role="navbar" data-position="fixed">',
            _ '<ul>',
              _ '<li>', _ '<a>', 'Date'
              _ '<li>', _ '<a>', 'Show'
    ]

  renderContent: (r)->
    if r and not @content
      @content = r
      $content = @$ '[data-role="content"]'
      for n in r
        $content.append n
    return

  bind:
    afterRender: ->
      @renderContent @renderPage cell.renderHelper, (r2)=> @renderContent r2
      return false
