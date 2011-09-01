define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  render: (_,A)-> [
    _ 'img'
    _ '.nameGroup',
      _ 'h2.name'
      _ 'h4.bornInfo'
    _ '.knownForGroup',
      _ 'h4.knownForHeader', 'Known For'
      _ '.knownForList', ''
  ]

  afterRender: ->
    @model.bind 'change:data', (data)=> @update data
    @update @model.data

  update: ({id,title})-> 
    @model.set title: title or 'Loading...'
    S.actor.getDetails id, ({name,born,knownFor})=>
      @model.set title: name
      @$('.name').html name
      @$('.bornInfo').html born.year
      @$('.knownForList > .ListView').remove()
      @$('.knownForGroup > .knownForList')
        .append cell::$R ListView, list: do->
          for {id,role,title} in knownFor then do->
            link: "#!/pages/showdetails/ShowDetails?id=#{id}&title=#{title}"
            text: title
      
      @model.trigger 'refreshScroller'
