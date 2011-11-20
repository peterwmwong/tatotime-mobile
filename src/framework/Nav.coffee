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
      hash: hash
      context: context =
        if (ctxid = result?[1]) and AppConfig.contexts[ctxid]
          ctxid
        else AppConfig.defaultContext
      page:
        if (page = result?[3]) and (page.substr(-1) isnt '/')
          page
        else
          AppConfig.contexts[context].defaultPagePath
      data: do->
        data = {}
        if jsondata = result?[5]
          for kv in jsondata.split '&'
            [k,v] = kv.split '='
            data[k] = decodeURIComponent v
        data

    current: new Model parseHash HashDelegate.get()

    canBack: ->
      contextHists[Nav.current.context]?.length > 1

    goBack: ->
      # TODO window.location.back()
      hist = contextHists[Nav.current.context]
      if hist.length > 1
        _backHash = hist[1]
        HashDelegate.set _backHash.hash

    goTo: (pageUrl)-> HashDelegate.set "#{Nav.current.context}!#{pageUrl}"

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
    h = new Model Nav.parseHash HashDelegate.get()
    ctxHist = contextHists[h.context]

    # Context Switch
    if Nav.current.context isnt h.context
      _backHash = undefined
      Nav.set {current:h}, {isBack:false,isContextSwitch:true}

    # Going Back
    else if _backHash
      # Rewind Context's History to Back hash
      # (for people stabbing their back button)
      i = 0
      ++i while ctxHist[i].hash isnt _backHash.hash
      h = _backHash
      _backHash = undefined
      ctxHist.splice 0, i
      Nav.set {current:h}, {isBack:true,isContextSwitch:false}

    # Back button (going back, not initiated by us)
    else if h.hash is ctxHist[1]?.hash
      _backHash = undefined
      ctxHist.splice 0, 1
      Nav.set {current:h}, {isBack:true,isContextSwitch:false}

    # First time or Going forward
    else if ctxHist.length < 1 or ctxHist[0]?.hash isnt h.hash
      _backHash = undefined
      ctxHist.unshift h
      Nav.set {current:h}, {isBack:false,isContextSwitch:false}
          
  Nav