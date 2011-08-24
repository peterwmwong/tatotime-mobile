define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  _ = cell::$R

  render: (_,A)-> [
    _ 'img'
    _ '.titleGroup',
      _ 'h2.title'
      _ 'h4.year'
      _ 'h4.network'
    _ 'p.description'
    _ '.castGroup',
      _ 'h4.castHeader', 'Cast'
      _ '.castList', ''
  ]

  afterRender: ->
    @model.bind 'change:data', (data)=> @update data
    @update @model.data

  update: ({id})-> 
    @model.set 'title', undefined
    S.show.getDetails id, ({title,description,network,year,cast})=>
      @model.set 'title', title
      @$('.title').html title
      @$('.year').html year
      @$('.description').html description
      @$('.network').html network
      @$('.castGroup > .castList > .ListView').remove()
      @$('.castGroup > .castList')
        .append _ ListView, list: do->
          for {id,name} in cast then do->
            text: name
            link: 'blarg'

      @model.trigger 'refreshScroller'

    