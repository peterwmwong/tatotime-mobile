define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  extends: 'shared/Page'
  renderContent: (_,A)-> S.show.getDetails @options.id, ({title,description})=>
    @_renderHeader [
      _ 'h2', title
    ]
    A [
      _ 'p', description
    ]