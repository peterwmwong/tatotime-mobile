define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  render: (_,A)-> S.show.getDetails @options.id, ({title,description})=>
    @options.pageService.setTitle title
    A [
      _ 'h2.title', title
      _ 'p.description', description 
    ]

  afterRender: ->
    @$title = @$ 'h2.title'
    @$description = @$ 'h2.description'

  update: (options)-> S.show.getDetails options.id, ({title,description})=>
    console.log 'blarg'
    @options.pageService.setTitle title
    @$title.html title
    @$description.html description
    