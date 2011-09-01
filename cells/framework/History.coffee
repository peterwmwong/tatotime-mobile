define [
  './Model'
], (Model)->

  hash = (fullpath)-> "#!/#{fullpath}"
  parseHash = (defaultCellPath)->
    [cellpath,jsondata] = (fullpath = window.location.hash.slice(3)).split '?'
    data = {}
    if jsondata
      for kv in jsondata.split '&'
        [k,v] = kv.split '='
        data[k] = v

    if not cellpath
      cellpath = defaultCellPath
    new Model {cellpath,fullpath,data,title:'Loading...'}

  class History extends Model
    constructor: ({@defaultCellPath})->
      super
        wasLastBack: false
        length: -> @_hist.length
        current: parseHash @defaultCellPath
      @_hist = [@current]
      $(window).bind 'hashchange', => @_doHashChange()

    goBack: ->
      if @_hist.length > 1
        window.location.hash = hash @_hist[1].fullpath
        @_doHashChange()

    ###
    Location hash change handler
    The hash determines:
      1) which page we're on
      2) data passed to the page
    ###
    _doHashChange: ->
      entry = parseHash()
      if entry.fullpath isnt @current.fullpath

        if @_hist[1]?.fullpath is entry.fullpath
          @_hist.shift()
          @_hist[0].data = entry.data
          @set wasLastBack: true

        else
          @_hist.unshift entry
          @set wasLastBack: false

        window.location.hash = hash entry.fullpath
        @set current: @_hist[0]

  History