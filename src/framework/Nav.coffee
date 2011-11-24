define [
  'AppConfig'
  'HashDelegate'
  './Model'
], (AppConfig, HashDelegate, Model)->

  hashRx =
    /// ^
     \# ([^!^?]+)    # #context
    (!  ([^?]+)   )? # !p/a/g/e
    (\? (.+)      )? # ?d=a&t=a
    ///

  _backHash = undefined
  _fixedHash = false

  #TODO: Make data portion of hash JSON, don't try to forge it 
  #     into location search form (ex. ?k=v&k2=v2)

  Nav = new Model

    toHash: toHash = ({context,page,data})->
      ctx = (AppConfig.contexts[context] and context) or AppConfig.defaultContext
      hash =
        "##{ctx}!#{page or AppConfig.contexts[ctx].defaultPagePath}"
      if data
        prefix = '?'
        for k,v of data
          hash += "#{prefix}#{k}=#{encodeURIComponent v}"
          prefix = '&'
      hash

    parseHash: parseHash = (hash)->
      result = hashRx.exec hash
      data = {}
      if jsondata = result?[5]
        for kv in jsondata.split '&'
          [k,v] = kv.split '='
          data[k] = decodeURIComponent v

      data: data
      hash: hash
      context: context = ((ctxid = result?[1]) and AppConfig.contexts[ctxid] and ctxid) or AppConfig.defaultContext
      page: ((page = result?[3]) and (page.substr(-1) isnt '/') and page) or AppConfig.contexts[context].defaultPagePath

    current: do->
      hash = parseHash HashDelegate.get()
      if hash.hash isnt (finalHashString = toHash hash)
        hash.hash = finalHashString
        _fixedHash = true
      new Model hash

    canBack: -> contextHists[Nav.current.context]?.length > 1

    goBack: ->
      # TODO window.location.back()
      hist = contextHists[Nav.current.context]
      if hist.length > 1
        _backHash = hist[1]
        HashDelegate.set _backHash.hash

    goTo: (pageUrl)->
      HashDelegate.set "#{Nav.current.context}!#{pageUrl}"

    switchContext: (ctxid)->
      if typeof ctxid is 'string' and (hist = contextHists[ctxid]) and Nav.current.context isnt ctxid
        # Use previous visit or create new
        HashDelegate.set toHash hist[0] or {context: ctxid, page: AppConfig.contexts[ctxid].defaultPage}


  window.ctxHists = contextHists = {}
  contextHists[ctx] = [] for ctx of AppConfig.contexts
  contextHists[Nav.current.context].push Nav.current

  Nav.bind
    'change:current': (e)->
      event = {}
      event[k] = v for k,v of e
      event.type = "change:current[context=#{e.cur.context}]"
      Nav.trigger event

  HashDelegate.onChange ->
    if _fixedHash then _fixedHash = false
    else
      h = parseHash HashDelegate.get()
      ctxHist = contextHists[h.context]

      backHash = _backHash
      _backHash = undefined

      # Context Switch
      if Nav.current.context isnt h.context
        Nav.set {current: ctxHist.length and ctxHist[0] or new Model h}, {isBack:false,isContextSwitch:true}

      # Going Back
      else if backHash
        # Rewind Context's History to Back hash
        # (for people stabbing their back button)
        i = 0
        while ctxHist[i++].hash isnt backHash.hash then
        h = backHash
        ctxHist.splice 0, i-1
        Nav.set {current:h}, {isBack:true,isContextSwitch:false}

      # Back button (going back, not initiated by us)
      else if h.hash is ctxHist[1]?.hash
        h = ctxHist[1]
        ctxHist.splice 0, 1
        Nav.set {current: h}, {isBack:true,isContextSwitch:false}

      # First time or Going forward
      else if ctxHist.length is 0 or ctxHist[0]?.hash isnt h.hash
        ctxHist.unshift h = new Model h
        Nav.set {current:h}, {isBack:false,isContextSwitch:false}
    return
    
  if _fixedHash
    HashDelegate.set Nav.current.hash
  Nav