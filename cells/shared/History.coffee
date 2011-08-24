define ->
  # Keeps track of page history
  hist = []
  wasLastBack = false

  hist.back = ->
    if hist.length > 1
      wasLastBack = true
      window.location.hash = "#!/#{hist.splice(0,2)[1]}"
      console.log hist
      
  hist.forward = (path)->
    wasLastBack = false
    hist.unshift path
    
  hist.wasLastBack = -> wasLastBack

  hist