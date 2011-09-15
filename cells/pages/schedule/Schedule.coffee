define [
  'Services'
  'shared/DateHelper'
  'cell!shared/ListView'
], (S,DateHelper,ListView)->

  init: ->
    @model.set title: DateHelper.getDisplayable new Date()
    @model.bind 'activate': => @$('#ShowList').trigger 'resetActive'

  render: (_, A)->
    S.user.getShows new Date(), (shows)=>
      A [
        _ ListView, id: 'ShowList', list: for s in shows then do->
          link: "#Schedule!pages/showdetails/ShowDetails?id=#{s.id}&title=#{s.title}"
          text: s.title
      ]
      @model.trigger 'refreshScroller'
