define [
  'Services'
  'cell!shared/ListView'
], (S,ListView)->

  render: (_,A)-> S.show.getDetails @options.id, ({title,description})=> A [
    _ 'h2', title+@options.id
    _ 'p', description 
  ]