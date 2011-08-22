define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  today = new Date()
  offsetDayMap = ['Today','Yesterday'].concat (for i in [2...7] then "#{i} days ago"), "a week ago"
  createDisplayableDate = (o)->
    if today.getYear() is o.getYear() and today.getMonth() is o.getMonth()
      offsetDayMap[ today.getDate() - o.getDate() ]
    else
      o.toLocaleDateString()

  init: ->
    @options.pageService.setTitle 'Watch'

  render: (_, A)->
    S.user.getShows (shows)-> A [
      _ ListView, list: for s in shows then do->
        link: "#!/pages/showdetails/ShowDetails?id=#{s.id}"
        text: s.title
    ]
