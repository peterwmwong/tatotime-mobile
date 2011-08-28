define [
  'shared/Model'
], (Model)->

  hash = (fullpath)-> "#!/#{fullpath}"
  parseHash = ->
    [cellpath,jsondata] = (fullpath = window.location.hash.slice(3)).split '?'
    data = {}
    if jsondata
      for kv in jsondata.split '&'
        [k,v] = kv.split '='
        data[k] = v

    if not cellpath
      cellpath = 'pages/watch/Watch'
    {cellpath,fullpath,data}

  History = new Model
    wasLastBack: false
    length: -> hist.length
    current: parseHash()

  # Keeps track of page history
  hist = [History.current]

  History.goBack = ->
    if hist.length > 1
      window.location.hash = hash hist[1].fullpath
      doHashChange()

  ###
  Location hash change handler
  The hash determines:
    1) which page we're on
    2) data passed to the page
  ###
  doHashChange = ->
    entry = parseHash()
    if entry.fullpath isnt History.current.fullpath

      if hist[1]?.fullpath is entry.fullpath
        hist.shift()
        hist[0].data = entry.data
        History.set 'wasLastBack', true

      else
        hist.unshift entry
        History.set 'wasLastBack', false

      window.location.hash = hash entry.fullpath
      History.set 'current', hist[0]

      return false

  $(window).bind 'hashchange',doHashChange

  History