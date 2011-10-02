define [
  'require'
  'Services'
  'shared/DateHelper'
  'cell!shared/ListView'
], (require,S,DateHelper,ListView)->

  ShowDetailsPage = 'pages/showdetails/ShowDetails'

  init: ->
    # Pre-emptive/Deferred Loading
    require [ShowDetailsPage], ->
    @model.set title: DateHelper.getDisplayable new Date()
    @model.bind 'activate': => @$('#ShowList').trigger 'resetActive'

  render: (_, A)->
    S.user.getShows new Date(), (shows)=>
      A [
        _ ListView, id: 'ShowList', list: for s in shows then do->
          link: "#{ShowDetailsPage}?id=#{s.id}&title=#{s.title}"
          text: s.title
      ]
      @model.trigger 'refreshScroller'
