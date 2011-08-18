define ->
  bus = $ document.createElement 'div'
  
  trigger: (ev)-> bus.trigger ev
  one: (type, cb)-> bus.one type, cb
  bind: (args...)-> bus.bind args...
  unbind: (type, cb)->
    # You MUST specify a handler to be unbound
    # Prevent all handlers of {type} from being unbound
    if typeof cb == 'function'
      bus.unbind type, cb
