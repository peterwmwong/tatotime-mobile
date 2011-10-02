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
        _ ListView, id: 'ShowList', list: for i in [0..10] then do->
          link: "#Watch!go/no/where"
          text: "#{i}"
      ]
      @model.trigger 'refreshScroller'
