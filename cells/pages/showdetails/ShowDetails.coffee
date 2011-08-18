define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  extends: 'shared/Page'
  renderPage: (_,A)-> S.show.getDetails @options.id, ({title,description})=> A [
    _ 'h1', title
    _ 'p', description
  ]