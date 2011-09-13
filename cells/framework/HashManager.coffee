define [
  './Model'
], (Model)->

  hashRx =
    /// ^
     \# ([^!^?]+)    # #context
    (!  ([^?]+)   )? # !p/a/g/e
    (\? (.+)      )? # ?d=a&t=a
    ///

  class HashManager extends Model

    constructor: ({
      appConfig:
        contexts: @_ctxs
        defaultContext: @_defctx
      @hashDelegate
    })->
      super current: @parseHash @hashDelegate.get()

      @bind 'change:current': (e)=>
        event = {}
        event[k] = v for k,v of e
        event.type = "change:current[context=#{e.cur.context}]"
        @trigger event

      @hashDelegate.onChange =>
        if @current isnt (cur = @parseHash @hashDelegate.get())
          @set current: cur

    toHash: ({context,page,data})->
      hash =
        "##{ctx = ((@_ctxs[context] and context) or @_defctx)}" +
          "!#{page or @_ctxs[ctx].defaultPagePath}"
      if data
        prefix = '?'
        for k,v of data
          hash += "#{prefix}#{k}=#{encodeURIComponent v}"
          prefix = '&'
      hash

    parseHash: (hash)->
      result = hashRx.exec hash
      
      hash: hash
      context: context =
        if (ctxid = result?[1]) and @_ctxs[ctxid]
          ctxid
        else @_defctx
      page:
        if (page = result?[3]) and (page.substr(-1) isnt '/')
          page
        else
          @_ctxs[context].defaultPagePath
      data: do->
        data = {}
        if jsondata = result?[5]
          for kv in jsondata.split '&'
            [k,v] = kv.split '='
            data[k] = decodeURIComponent v
          data
        data