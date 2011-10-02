define
  set: (hash)-> window.location.hash = hash
  get: -> window.location.hash
  onChange: (cb)-> $(window).bind 'hashchange', cb