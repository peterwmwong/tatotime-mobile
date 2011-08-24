define ['data/mock/actors/allActors'], (actors)->
  _ = (o)->o
  count = 0
  (path)->
    id = do->
      s = path.split '/'
      s[s.length-1]
    actors[id]