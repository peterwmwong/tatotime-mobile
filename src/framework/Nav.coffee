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
    goBack: -> HashDelegate.set h if h = contextHists[Nav.current.context][1]?.hash
    goTo: (pageUrl)-> HashDelegate.set "##{Nav.current.context}!#{pageUrl}"
    switchContext: (ctxid)->
      if typeof ctxid is 'string' and (hist = contextHists[ctxid]) and Nav.current.context isnt ctxid
        # Use previous visit or create new
        HashDelegate.set toHash hist[0] or {context: ctxid, page: AppConfig.contexts[ctxid].defaultPage}

  contextHists = {}
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

      # Context Switch
      if Nav.current.context isnt h.context
        Nav.set {
          current: 
            if ctxHist.length then ctxHist[0]
            else
              ctxHist.unshift h = new Model h
              h
        }, {isBack:false,isContextSwitch:true}

      # Back button (going back, not initiated by us)
      else if h.hash is ctxHist[1]?.hash
        h = ctxHist[1]
        ctxHist.shift()
        Nav.set {current: h}, {isBack:true,isContextSwitch:false}

      # First time or Going forward
      else if ctxHist.length is 0 or ctxHist[0].hash isnt h.hash
        ctxHist.unshift h = new Model h
        Nav.set {current:h}, {isBack:false,isContextSwitch:false}
    return
    
  HashDelegate.set Nav.current.hash if _fixedHash
  Nav