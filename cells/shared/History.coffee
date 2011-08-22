define ->
  # Keeps track of page history
  hist = []

  # Adds to the history or rewinds if "going back" is detected
  hist.addOrRewind = (fullpath)->
    if (i = @indexOf fullpath) is -1
      @unshift fullpath
      true
    else
      @splice 0, i
      false

  # Finds index of page in history, -1 if not history
  hist.indexOf = (path)->
    for p,i in this when p is path
      return i
    return -1

  hist