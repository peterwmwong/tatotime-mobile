define(['SpecHelpers', './HashManager', './Model'], function(_arg, HashManager, Model) {
  var spyOnAll;
  spyOnAll = _arg.spyOnAll;
  return describe('HashManger', function() {
    var hashmgr, hashmgrOnChange, mAppConfig, mHashDelegate, mInitialHash;
    mInitialHash = '#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty the Clown&z=Sam%20I%20Am';
    mHashDelegate = null;
    mAppConfig = {
      defaultContext: 'ctx1',
      contexts: {
        ctx1: {
          defaultPagePath: 'path1'
        },
        ctx2: {
          defaultPagePath: 'path2'
        }
      }
    };
    hashmgr = null;
    hashmgrOnChange = null;
    beforeEach(function() {
      var _ref;
      spyOnAll(mHashDelegate = {
        get: function() {
          return mInitialHash;
        },
        onChange: function() {}
      });
      mHashDelegate.get.andReturn(mInitialHash);
      hashmgr = new HashManager({
        hashDelegate: mHashDelegate,
        appConfig: mAppConfig
      });
      return hashmgrOnChange = (_ref = mHashDelegate.onChange.argsForCall[0]) != null ? _ref[0] : void 0;
    });
    describe('new HashManager({ appConfig, hashDelegate:{get,set,onChange} })', function() {
      it('is an instanceof Model', function() {
        return expect(hashmgr instanceof Model).toBe(true);
      });
      it('calls hashDelegate.onChange with a callback function', function() {
        return expect(typeof hashmgrOnChange === 'function').toBe(true);
      });
      return it('@current is set to parsed initial hash (hashDelegate.get())', function() {
        return expect(hashmgr.current).toEqual({
          hash: mInitialHash,
          context: 'ctx1',
          page: 'a/b-c/d_ef/_gh/-ijk',
          data: {
            w: 'val',
            x: '0',
            y: 'Krusty the Clown',
            z: 'Sam I Am'
          }
        });
      });
    });
    describe('@parseHash()', function() {
      var parses;
      parses = function(hashes, expected) {
        var h, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = hashes.length; _i < _len; _i++) {
          h = hashes[_i];
          _results.push((function(h) {
            var e, k, v;
            e = {};
            for (k in expected) {
              v = expected[k];
              e[k] = v;
            }
            e.hash = h;
            return it("parses '" + h + "'", function() {
              return expect(hashmgr.parseHash(h)).toEqual(e);
            });
          })(h));
        }
        return _results;
      };
      parses(['', '#', '#!', '#?', '#!?', '#!/', '#!/?', '#!ignore/me?because=no&context=specified'], {
        context: 'ctx1',
        page: 'path1',
        data: {}
      });
      parses(['#/', '#/!/', '#/!ignore-me-cause-Im-a-directory/'], {
        context: 'ctx1',
        page: 'path1',
        data: {}
      });
      parses(["#ctx1", '#ctx1!', '#ctx1!/?', '#badContextThatWillBeDefaulted!/?'], {
        context: 'ctx1',
        page: 'path1',
        data: {}
      });
      parses(['#ctx2!a/b-c/d_ef/_gh/-ijk', '#ctx2!a/b-c/d_ef/_gh/-ijk?'], {
        context: 'ctx2',
        page: 'a/b-c/d_ef/_gh/-ijk',
        data: {}
      });
      return parses(['#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty the Clown&z=Sam%20I%20Am'], {
        context: 'ctx1',
        page: 'a/b-c/d_ef/_gh/-ijk',
        data: {
          w: 'val',
          x: '0',
          y: 'Krusty the Clown',
          z: 'Sam I Am'
        }
      });
    });
    describe('@toHash', function() {
      it('"##{AppConfig.defaultContext}!#{defaultPagePath}, when passed unknown OR no context', function() {
        var ctx;
        return expect(hashmgr.toHash({})).toBe("#" + (ctx = mAppConfig.defaultContext) + "!" + mAppConfig.contexts[ctx].defaultPagePath);
      });
      it('uses AppConfig.contexts[context].defaultPagePath when given unknown OR no page', function() {
        expect(hashmgr.toHash({
          context: 'ctx1'
        })).toBe("#ctx1!" + mAppConfig.contexts.ctx1.defaultPagePath);
        return expect(hashmgr.toHash({
          context: 'ctx1',
          data: {
            a: 'b'
          }
        })).toBe("#ctx1!" + mAppConfig.contexts.ctx1.defaultPagePath + "?a=b");
      });
      return it('context/page/data', function() {
        var input;
        input = {
          context: 'ctx2',
          page: 'a/b/c',
          data: {
            d: 'e',
            f: 'g'
          }
        };
        return expect(hashmgr.toHash(input)).toBe("#ctx2!a/b/c?d=e&f=g");
      });
    });
    return describe('onChange handler', function() {
      var binds, hash;
      hash = '#ctx1!testpage?a=b&c=d';
      binds = null;
      beforeEach(function() {
        mHashDelegate.get.andReturn(hash);
        hashmgr.bind(spyOnAll(binds = {
          'change:current': function() {},
          'change:current[context=ctx1]': function() {}
        }));
        return hashmgrOnChange();
      });
      it('updates @current', function() {
        return expect(hashmgr.current).toEqual({
          hash: hash,
          context: 'ctx1',
          page: 'testpage',
          data: {
            a: 'b',
            c: 'd'
          }
        });
      });
      it('emits "change:current" event', function() {
        return expect(binds['change:current'].argsForCall[0][0]).toEqual({
          cur: {
            hash: hash,
            context: 'ctx1',
            page: 'testpage',
            data: {
              a: 'b',
              c: 'd'
            }
          },
          prev: {
            hash: mInitialHash,
            context: 'ctx1',
            page: 'a/b-c/d_ef/_gh/-ijk',
            data: {
              w: 'val',
              x: '0',
              y: 'Krusty the Clown',
              z: 'Sam I Am'
            }
          },
          model: hashmgr,
          property: 'current',
          type: 'change:current'
        });
      });
      return it('emits "change:current[context=ctx1]" event', function() {
        return expect(binds['change:current[context=ctx1]'].argsForCall[0][0]).toEqual({
          cur: {
            hash: hash,
            context: 'ctx1',
            page: 'testpage',
            data: {
              a: 'b',
              c: 'd'
            }
          },
          prev: {
            hash: mInitialHash,
            context: 'ctx1',
            page: 'a/b-c/d_ef/_gh/-ijk',
            data: {
              w: 'val',
              x: '0',
              y: 'Krusty the Clown',
              z: 'Sam I Am'
            }
          },
          model: hashmgr,
          property: 'current',
          type: 'change:current[context=ctx1]'
        });
      });
    });
  });
});