define ->
  class PageService
    constructor: (@pagecellpath)->
      @_title = ''
      @$ev = $(document.createElement 'div')

    getTitle: -> @_title
    setTitle: (newTitle)->
      @_title = newTitle
      @$ev.trigger type: 'titleChange', title: @_title

    bind: (type, handler)->
      @$ev.bind type, handler

    unbind: (type, handler)->
      @$ev.unbind type, handler

    