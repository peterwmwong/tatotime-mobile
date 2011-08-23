define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  render: (_,A)-> [
    _ 'h2.title'
    _ 'p.description'
  ]

  afterRender: ->
    @$title = @$ 'h2.title'
    @$description = @$ 'p.description'
    @model.bind 'change:data', (data)=> @update data
    @update @model.data

  update: ({id})-> 
    @model.set 'title', undefined
    S.show.getDetails id, ({title,description})=>
      @model.set 'title', title
      @$title.html title
      @$description.html description
    