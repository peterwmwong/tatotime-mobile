define [
  'SpecHelpers'
  './HashManager'
  './Model'
], ({spyOnAll},HashManager,Model)->

  #----------------------------------------------------------------------
  describe 'HashManger', ->

    mInitialHash = '#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty the Clown&z=Sam%20I%20Am'
    mHashDelegate = null
    mAppConfig =
      defaultContext: 'ctx1'
      contexts:
        ctx1: 
          defaultPagePath:'path1'
        ctx2: 
          defaultPagePath:'path2'
    hashmgr = null
    hashmgrOnChange = null

    beforeEach ->
      spyOnAll mHashDelegate =
        get: -> mInitialHash
        onChange: ->
      mHashDelegate.get.andReturn mInitialHash
      hashmgr = new HashManager
        hashDelegate: mHashDelegate
        appConfig: mAppConfig
      hashmgrOnChange = mHashDelegate.onChange.argsForCall[0]?[0]

    describe 'new HashManager({ appConfig, hashDelegate:{get,set,onChange} })', ->

      it 'is an instanceof Model', ->
        expect(hashmgr instanceof Model).toBe true

      it 'calls hashDelegate.onChange with a callback function', ->
        expect(typeof hashmgrOnChange is 'function').toBe true

      it '@current is set to parsed initial hash (hashDelegate.get())', ->
        expect(hashmgr.current).toEqual
          hash: mInitialHash
          context: 'ctx1'
          page: 'a/b-c/d_ef/_gh/-ijk'
          data:
            w: 'val'
            x: '0'
            y: 'Krusty the Clown'
            z: 'Sam I Am'

    #----------------------------------------------------------------------
    describe '@parseHash()', ->

      parses = (hashes, expected)->
        for h in hashes then do(h)->
          e = {}
          for k,v of expected
            e[k] = v
          e.hash = h
          it "parses '#{h}'", -> expect(hashmgr.parseHash h).toEqual e

      parses [
        ''
        '#'
        '#!'
        '#?'
        '#!?'
        '#!/'
        '#!/?'
        '#!ignore/me?because=no&context=specified'
      ],
        context: 'ctx1'
        page: 'path1'
        data: {}


      parses [
        '#/'
        '#/!/'
        '#/!ignore-me-cause-Im-a-directory/'
      ], 
        context: 'ctx1'
        page: 'path1'
        data: {}


      parses [
        "#ctx1"
        '#ctx1!'
        '#ctx1!/?'
        '#badContextThatWillBeDefaulted!/?'
      ],
        context: 'ctx1'
        page: 'path1'
        data: {}


      parses [
        '#ctx2!a/b-c/d_ef/_gh/-ijk'
        '#ctx2!a/b-c/d_ef/_gh/-ijk?'
      ],
        context: 'ctx2'
        page: 'a/b-c/d_ef/_gh/-ijk'
        data: {}


      parses ['#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty the Clown&z=Sam%20I%20Am'],
        context: 'ctx1'
        page: 'a/b-c/d_ef/_gh/-ijk'
        data:
          w: 'val'
          x: '0'
          y: 'Krusty the Clown'
          z: 'Sam I Am'
  
    
    #----------------------------------------------------------------------
    describe '@toHash', ->

      it '"##{AppConfig.defaultContext}!#{defaultPagePath}, when passed unknown OR no context', ->
        expect(hashmgr.toHash {}).toBe "##{ctx = mAppConfig.defaultContext}!#{mAppConfig.contexts[ctx].defaultPagePath}"

      it 'uses AppConfig.contexts[context].defaultPagePath when given unknown OR no page', ->
        expect(hashmgr.toHash {context: 'ctx1'}).toBe "#ctx1!#{mAppConfig.contexts.ctx1.defaultPagePath}"
        expect(hashmgr.toHash {context: 'ctx1', data: {a:'b'}}).toBe "#ctx1!#{mAppConfig.contexts.ctx1.defaultPagePath}?a=b"

      it 'context/page/data', ->
        input =
          context: 'ctx2'
          page: 'a/b/c'
          data:
            d:'e'
            f:'g'
        expect(hashmgr.toHash input).toBe "#ctx2!a/b/c?d=e&f=g"


    #----------------------------------------------------------------------
    describe 'onChange handler', ->
      hash = '#ctx1!testpage?a=b&c=d'
      binds = null

      beforeEach ->
        mHashDelegate.get.andReturn hash
        hashmgr.bind spyOnAll binds =
          'change:current': ->
          'change:current[context=ctx1]': ->
        hashmgrOnChange()

      it 'updates @current', ->
        expect(hashmgr.current).toEqual
          hash: hash
          context: 'ctx1'
          page: 'testpage'
          data:
            a:'b'
            c:'d'
      
      it 'emits "change:current" event', ->
        expect(binds['change:current'].argsForCall[0][0]).toEqual
          cur:
            hash: hash
            context: 'ctx1'
            page: 'testpage'
            data:
              a:'b'
              c:'d'
          prev:
            hash: mInitialHash
            context: 'ctx1'
            page: 'a/b-c/d_ef/_gh/-ijk'
            data:
              w: 'val'
              x: '0'
              y: 'Krusty the Clown'
              z: 'Sam I Am'
          model: hashmgr
          property: 'current'
          type: 'change:current'
      
      it 'emits "change:current[context=ctx1]" event', ->
        expect(binds['change:current[context=ctx1]'].argsForCall[0][0]).toEqual
          cur:
            hash: hash
            context: 'ctx1'
            page: 'testpage'
            data:
              a:'b'
              c:'d'
          prev:
            hash: mInitialHash
            context: 'ctx1'
            page: 'a/b-c/d_ef/_gh/-ijk'
            data:
              w: 'val'
              x: '0'
              y: 'Krusty the Clown'
              z: 'Sam I Am'
          model: hashmgr
          property: 'current'
          type: 'change:current[context=ctx1]'
