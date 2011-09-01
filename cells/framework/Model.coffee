define ->
  class
    constructor: (attrs)->
      @_ls = {}
      for k,v of attrs
        @[k]=v

    set: (kvMap)->
      for k,v of kvMap when @[k] isnt v
        try @trigger "change:#{k}", (@[k] = v)

    trigger: (type,data)->
      if ls = @_ls[type]
        for l in ls
          try l data
    
    bind: (type,handler)->
      ls = (@_ls[type] ?= [])
      for l in ls when l is handler
        return
      ls.unshift handler

    unbind: (type,handler)->
      if ls = @_ls[type]
        for l,i in ls when l is handler
          delete ls[i]
          return
      return
