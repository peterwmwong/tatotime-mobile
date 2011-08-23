define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  render: (_,A)-> [
    _ 'img'
    _ '.titleGroup',
      _ 'h2.title'
      _ 'h3.year'
      _ 'h3.network'
    _ 'p.description'
  ]

  afterRender: ->
    @$title = @$ 'h2.title'
    @$year = @$ 'h3.year'
    @$network = @$ 'h3.network'
    @$description = @$ 'p.description'
    @model.bind 'change:data', (data)=> @update data
    @update @model.data

  update: ({id})-> 
    @model.set 'title', undefined
    S.show.getDetails id, ({title,description,network,year})=>
      @model.set 'title', title
      @$title.html title
      @$year.html year
      @$description.html description
      @$network.html network
    