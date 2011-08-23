define ->
  class
    constructor: (attrs)->
      @_ls = {}
      for k,v of attrs
        @[k]=v

    set: (attr, value)->
      @trigger "change:#{attr}", (@[attr] = value)

    trigger: (type,data)->
      if ls = @_ls[type]
        for l in ls
          try l data
    
    bind: (type,handler)->
      ls = (@_ls[type] ?= [])
      for l in ls when l is handler
        return
      ls.push handler

    unbind: (type,handler)->
      if ls = @_ls[type]
        for l,i in ls when l is handler
          delete ls[i]
          return
      return
