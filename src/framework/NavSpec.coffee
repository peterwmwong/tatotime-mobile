define [
  'SpecHelpers'
  './Model'
], ({spyOnAll},Model)->

  ({mockModules,loadModule})->
    mInitialHash = '#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty%20the%20Clown&z=Sam%20I%20Am'
    mHashDelegate = null
    mAppConfig =
      defaultContext: 'ctx1'
      contexts:
        ctx1: 
          defaultPagePath:'path1'
        ctx2: 
          defaultPagePath:'path2'
    Nav = null
    NavOnChange = null
    currentHash = undefined

    beforeEach ->
      currentHash = mInitialHash
      mockModules
        'framework/Model': Model
        AppConfig: mAppConfig
        HashDelegate:
          spyOnAll mHashDelegate =
            get: -> currentHash
            onChange: (cb)-> NavOnChange = cb
            set: (newHash)->
              NavOnChange currentHash = newHash
      loadModule (module)->
        Nav = module
    
    it 'is an instanceof Model', ->
      expect(Nav instanceof Model).toBe true

    describe 'Nav.canBack()', ->

      it 'returns true when current context history is <= 1', ->
        Nav.goTo 'test1'
        expect(Nav.canBack()).toBe true

      it 'returns true when current context history is > 1', ->
        expect(Nav.canBack()).toBe false
        Nav.goTo 'test1'
        expect(Nav.canBack()).toBe true
        Nav.goBack()
        expect(Nav.canBack()).toBe false


    it 'registers a callback function with HashDelegate.onChange', ->
      expect(typeof NavOnChange is 'function').toBe true

    it 'sets Nav.current to the parsed initial hash (HashDelegate.get())', ->
      expect(Nav.current).toEqual new Model
        hash: mInitialHash
        context: 'ctx1'
        page: 'a/b-c/d_ef/_gh/-ijk'
        data:
          w: 'val'
          x: '0'
          y: 'Krusty the Clown'
          z: 'Sam I Am'


    #----------------------------------------------------------------------
    describe 'Nav.goBack()', ->

      it 'does not call HashDelegate.set() if context history is empty', ->
        Nav.goBack()
        expect(mHashDelegate.set.argsForCall.length).toBe 0

      it 'calls HashDelegate.set() with previous hash for context', ->
        Nav.goTo 'test'
        expect(mHashDelegate.get()).toBe 'ctx1!test'
        
        Nav.goTo 'test2'
        expect(mHashDelegate.get()).toBe 'ctx1!test2'

        Nav.goBack()
        expect(mHashDelegate.get()).toBe 'ctx1!test'

        Nav.goBack()
        expect(mHashDelegate.get()).toBe mInitialHash

        mHashDelegate.set.reset()
        Nav.goBack()
        expect(mHashDelegate.get()).toBe mInitialHash
        expect(mHashDelegate.set).not.toHaveBeenCalled()


    #----------------------------------------------------------------------
    describe 'Nav.goTo(urlPath:string)', ->
      mUrlPath = "one/two/three?key1=val1&key2=val2"

      beforeEach ->
        Nav.goTo mUrlPath

      it 'calls HashDelegate.set("#{current context}!#{urlpath}")', ->
        expect(mHashDelegate.set).toHaveBeenCalledWith "#{mAppConfig.defaultContext}!#{mUrlPath}"

    #----------------------------------------------------------------------
    describe 'Nav.parseHash(hash:string)', ->

      itParses = (hashes, expected)->
        for h in hashes then do(h)->
          e = {}
          for k,v of expected
            e[k] = v
          e.hash ?= h
          it "parses '#{h}' to #{JSON.stringify e}", -> expect(Nav.parseHash h).toEqual e

      itParses [
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


      itParses [
        '#/'
        '#/!/'
        '#/!ignore-me-cause-Im-a-directory/'
      ], 
        context: 'ctx1'
        page: 'path1'
        data: {}


      itParses [
        "#ctx1"
        '#ctx1!'
        '#ctx1!/?'
        '#badContextThatWillBeDefaulted!/?'
      ],
        context: 'ctx1'
        page: 'path1'
        data: {}


      itParses [
        '#ctx2!a/b-c/d_ef/_gh/-ijk'
        '#ctx2!a/b-c/d_ef/_gh/-ijk?'
      ],
        context: 'ctx2'
        page: 'a/b-c/d_ef/_gh/-ijk'
        data: {}


      itParses ['#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty%20the%20Clown&z=Sam%20I%20Am'],
        context: 'ctx1'
        page: 'a/b-c/d_ef/_gh/-ijk'
        data:
          w: 'val'
          x: '0'
          y: 'Krusty the Clown'
          z: 'Sam I Am'
  
    
    #----------------------------------------------------------------------
    describe 'Nav.toHash({context,page,data})', ->

      it '"##{AppConfig.defaultContext}!#{defaultPagePath}, when passed unknown OR no context', ->
        expect(Nav.toHash {}).toBe "##{ctx = mAppConfig.defaultContext}!#{mAppConfig.contexts[ctx].defaultPagePath}"

      it 'uses AppConfig.contexts[context].defaultPagePath when given unknown OR no page', ->
        expect(Nav.toHash {context: 'ctx1'}).toBe "#ctx1!#{mAppConfig.contexts.ctx1.defaultPagePath}"
        expect(Nav.toHash {context: 'ctx1', data: {a:'b'}}).toBe "#ctx1!#{mAppConfig.contexts.ctx1.defaultPagePath}?a=b"

      it 'context/page/data', ->
        input =
          context: 'ctx2'
          page: 'a/b/c'
          data:
            d:'e'
            f:'g'
        expect(Nav.toHash input).toBe "#ctx2!a/b/c?d=e&f=g"


    #----------------------------------------------------------------------
    describe 'HashDelegate.onChange handler', ->
      hash = '#ctx1!testpage?a=b&c=d'
      binds = null

      beforeEach ->
        currentHash = hash
        Nav.bind spyOnAll binds =
          'change:current': ->
          'change:current[context=ctx1]': ->

      it "When the hash is the same, doesn't update or trigger 'change:current'/'change:current[context=ctx1]' events", ->
        NavOnChange()
        expect(binds['change:current'].argsForCall.length).toBe 1

        NavOnChange() # No Change in Hash
        expect(binds['change:current'].argsForCall.length).toBe 1
        expect(binds['change:current[context=ctx1]'].argsForCall.length).toBe 1


      #----------------------------------------------------------------------
      describe '[Back button] When the hash changes to the previous hash in the context history', ->

        beforeEach ->
          currentHash = '#ctx1!testpage?a=b&c=d'
          NavOnChange() # Go somewhere
          currentHash = mInitialHash
          NavOnChange() # Go back

        it 'updates Nav.current', ->
          expect(Nav.current).toEqual new Model
            hash: mInitialHash
            context: 'ctx1'
            page: 'a/b-c/d_ef/_gh/-ijk'
            data:
              w: 'val'
              x: '0'
              y: 'Krusty the Clown'
              z: 'Sam I Am'

        it 'triggers "change:current" event, with {data:{isBack:true}}', ->
          expect(binds['change:current']).toHaveBeenCalledWith
            cur: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            prev: new Model
              hash: hash
              context: 'ctx1'
              page: 'testpage'
              data:
                a:'b'
                c:'d'
            model: Nav
            property: 'current'
            type: 'change:current'
            data:
              isBack: true
              isContextSwitch: false

        it 'triggers "change:current[context=ctx1]" event, with {data:{isBack:true}}', ->
          expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith
            cur: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            prev: new Model
              hash: hash
              context: 'ctx1'
              page: 'testpage'
              data:
                a:'b'
                c:'d'
            model: Nav
            property: 'current'
            type: 'change:current[context=ctx1]'
            data:
              isBack: true
              isContextSwitch: false


      #----------------------------------------------------------------------
      describe 'When the hash changes', ->

        beforeEach ->
          NavOnChange()

        it 'updates Nav.current', ->
          expect(Nav.current).toEqual new Model
              hash: hash
              context: 'ctx1'
              page: 'testpage'
              data:
                a:'b'
                c:'d'
        
        it 'triggers "change:current" event', ->
          expect(binds['change:current']).toHaveBeenCalledWith
            cur: new Model
              hash: hash
              context: 'ctx1'
              page: 'testpage'
              data:
                a:'b'
                c:'d'
            prev: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            model: Nav
            property: 'current'
            type: 'change:current'
            data:
              isBack: false
              isContextSwitch: false
        
        it 'triggers "change:current[context=ctx1]" event', ->
          expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith
            cur: new Model
              hash: hash
              context: 'ctx1'
              page: 'testpage'
              data:
                a:'b'
                c:'d'
            prev: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            model: Nav
            property: 'current'
            type: 'change:current[context=ctx1]'
            data:
              isBack: false
              isContextSwitch: false


    #----------------------------------------------------------------------
    describe 'Nav.switchContext(contextId:string)', ->
      binds = null

      beforeEach ->
        Nav.bind spyOnAll binds =
          'change:current': ->
          'change:current[context=ctx1]': ->
          'change:current[context=ctx2]': ->

      it 'does nothing when contextId is not valid context (not part of AppConfig.contexts)', ->
        Nav.switchContext 'bogus context'
        expect(binds['change:current']).not.toHaveBeenCalled()
        expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled()

      it 'does nothing when contextId is not a string, undefined, or null', ->
        Nav.switchContext undefined
        Nav.switchContext null
        Nav.switchContext 5
        Nav.switchContext {}
        expect(binds['change:current']).not.toHaveBeenCalled()
        expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled()
      

      #----------------------------------------------------------------------
      describe 'When switching to a new context (ctx2)', ->

        beforeEach ->
          Nav.switchContext 'ctx2'

        it 'updates Nav.current', ->
          expect(Nav.current).toEqual new Model
              hash: '#ctx2!path2'
              context: 'ctx2'
              page: 'path2'
              data: {}
        
        it 'does NOT trigger "change:current[context=ctx1]" event', ->
          expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled()

        it 'triggers "change:current" event', ->
          expect(binds['change:current']).toHaveBeenCalledWith
            cur: new Model
              hash: '#ctx2!path2'
              context: 'ctx2'
              page: 'path2'
              data: {}
            prev: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            model: Nav
            property: 'current'
            type: 'change:current'
            data:
              isBack: false
              isContextSwitch: true

        it 'triggers "change:current[context=ctx2]" event', ->
          expect(binds['change:current[context=ctx2]']).toHaveBeenCalledWith
            cur: new Model
              hash: '#ctx2!path2'
              context: 'ctx2'
              page: 'path2'
              data: {}
            prev: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            model: Nav
            property: 'current'
            type: 'change:current[context=ctx2]'
            data:
              isBack: false
              isContextSwitch: true


      #----------------------------------------------------------------------
      describe 'When switching to a previously context (ctx1)', ->

        beforeEach ->
          Nav.switchContext 'ctx2'
          binds['change:current[context=ctx1]'].reset()
          binds['change:current[context=ctx2]'].reset()
          Nav.switchContext 'ctx1'

        it 'updates Nav.current with last hash of the previously visited context', ->
          expect(Nav.current).toEqual new Model
            hash: mInitialHash
            context: 'ctx1'
            page: 'a/b-c/d_ef/_gh/-ijk'
            data:
              w: 'val'
              x: '0'
              y: 'Krusty the Clown'
              z: 'Sam I Am'

        it 'does NOT trigger "change:current[context=ctx1]" event', ->
          expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith
            cur: new Model
              hash: mInitialHash
              context: 'ctx1'
              page: 'a/b-c/d_ef/_gh/-ijk'
              data:
                w: 'val'
                x: '0'
                y: 'Krusty the Clown'
                z: 'Sam I Am'
            prev: new Model
              hash: '#ctx2!path2'
              context: 'ctx2'
              page: 'path2'
              data: {}
            model: Nav
            property: 'current'
            type: 'change:current[context=ctx1]'
            data:
              isBack: false
              isContextSwitch: true

        it 'does NOT trigger "change:current[context=ctx2]" event', ->
          expect(binds['change:current[context=ctx2]']).not.toHaveBeenCalled()