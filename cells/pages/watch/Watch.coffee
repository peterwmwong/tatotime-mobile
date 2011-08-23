define [
  'Services'
  'shared/DateHelper'
  'cell!shared/ListView'
], (S,DateHelper,ListView)->

  init: ->
    @model.set 'title', DateHelper.getDisplayable new Date()
    @model.bind 'activate', =>
      @$('.ListView li.active').removeClass('active')

  render: (_, A)->
    S.user.getShows (shows)-> A [
      _ ListView, list: for s in shows then do->
        link: "#!/pages/showdetails/ShowDetails?id=#{s.id}"
        text: s.title
    ]
