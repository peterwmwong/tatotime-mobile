define ['data/mock/shows/allShows'], (allShows)->
  _ = (o)->o
  count = 0
  (path)->
    id = do->
      s = path.split '/'
      s[s.length-1]
    allShows[id]