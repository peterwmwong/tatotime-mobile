define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

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
    @model.bindAndCall 'change:data': ({cur:data})=>
      @model.set title: 'Loading...'
      S.show.getDetails data.id, ({title,description,network,year,cast})=>
        @model.set title: title
        @$('.title').html title
        @$('.year').html year
        @$('.description').html (description.length <= 125) and description or "#{description.slice 0,125}..."
        @$('.network').html network
        @$('.castGroup > .castList > .ListView').remove()
        @$('.castGroup > .castList')
          .append cell::$R ListView, list: do->
            for {id,name} in cast then do->
              link: "#Schedule!pages/profiledetails/ProfileDetails?id=#{id}&title=#{name}"
              text: name

        @model.trigger 'refreshScroller'
