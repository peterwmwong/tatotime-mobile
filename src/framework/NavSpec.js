
define(['SpecHelpers', './Model'], function(_arg, Model) {
  var spyOnAll;
  spyOnAll = _arg.spyOnAll;
  return function(_arg2) {
    var loadModule, mInitialHash, mockModules;
    mockModules = _arg2.mockModules, loadModule = _arg2.loadModule;
    describe("When the hash is initially ''", function() {
      var Nav, NavOnChange, currentHash, mAppConfig, mHashDelegate, triggerOnChange;
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
      Nav = null;
      NavOnChange = null;
      currentHash = void 0;
      triggerOnChange = void 0;
      beforeEach(function() {
        triggerOnChange = void 0;
        currentHash = '';
        mockModules({
          'framework/Model': Model,
          AppConfig: mAppConfig,
          HashDelegate: spyOnAll(mHashDelegate = {
            get: function() {
              return currentHash;
            },
            onChange: function(cb) {
              return NavOnChange = cb;
            },
            set: function(newHash) {
              return triggerOnChange = function() {
                return NavOnChange(currentHash = newHash);
              };
            }
          })
        });
        return loadModule(function(module) {
          return Nav = module;
        });
      });
      it('Nav.current set to defaultContext, defaultPagePath (of defaultContext), and {} for data', function() {
        return expect(Nav.current).toEqual(new Model({
          hash: "#" + mAppConfig.defaultContext + "!" + mAppConfig.contexts[mAppConfig.defaultContext].defaultPagePath,
          context: mAppConfig.defaultContext,
          page: mAppConfig.contexts[mAppConfig.defaultContext].defaultPagePath,
          data: {}
        }));
      });
      it('HashDelegate.set() called with "##{defaultContext}!#{defaultPagePath}"', function() {
        return expect(mHashDelegate.set).toHaveBeenCalledWith("#" + mAppConfig.defaultContext + "!" + mAppConfig.contexts[mAppConfig.defaultContext].defaultPagePath);
      });
      return describe('and then HashDelegate.onChange() is called in response to setting the default hash', function() {
        var binds;
        binds = void 0;
        beforeEach(function() {
          Nav.bind(spyOnAll(binds = {
            'change:current': function() {},
            'change:current[context=ctx1]': function() {}
          }));
          currentHash = Nav.current;
          return triggerOnChange();
        });
        return it('does NOT call any bindings', function() {
          expect(binds['change:current']).wasNotCalled();
          return expect(binds['change:current[context=ctx1]']).wasNotCalled();
        });
      });
    });
    return describe("When the hash is initially " + (mInitialHash = '#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty%20the%20Clown&z=Sam%20I%20Am'), (function(mInitialHash) {
      return function() {
        var Nav, NavOnChange, currentHash, mAppConfig, mHashDelegate;
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
        Nav = null;
        NavOnChange = null;
        currentHash = void 0;
        beforeEach(function() {
          currentHash = mInitialHash;
          mockModules({
            'framework/Model': Model,
            AppConfig: mAppConfig,
            HashDelegate: spyOnAll(mHashDelegate = {
              get: function() {
                return currentHash;
              },
              onChange: function(cb) {
                return NavOnChange = cb;
              },
              set: function(newHash) {
                return NavOnChange(currentHash = newHash);
              }
            })
          });
          return loadModule(function(module) {
            return Nav = module;
          });
        });
        it('is an instanceof Model', function() {
          return expect(Nav instanceof Model).toBe(true);
        });
        describe('Nav.canBack()', function() {
          it('returns true when current context history is <= 1', function() {
            Nav.goTo('test1');
            return expect(Nav.canBack()).toBe(true);
          });
          return it('returns true when current context history is > 1', function() {
            expect(Nav.canBack()).toBe(false);
            Nav.goTo('test1');
            expect(Nav.canBack()).toBe(true);
            Nav.goBack();
            return expect(Nav.canBack()).toBe(false);
          });
        });
        it('registers a callback function with HashDelegate.onChange', function() {
          return expect(typeof NavOnChange === 'function').toBe(true);
        });
        it('Nav.current set to parsed initial hash (HashDelegate.get())', function() {
          return expect(Nav.current).toEqual(new Model({
            hash: mInitialHash,
            context: 'ctx1',
            page: 'a/b-c/d_ef/_gh/-ijk',
            data: {
              w: 'val',
              x: '0',
              y: 'Krusty the Clown',
              z: 'Sam I Am'
            }
          }));
        });
        describe('Nav.goBack()', function() {
          it('does not call HashDelegate.set() if context history is empty', function() {
            Nav.goBack();
            return expect(mHashDelegate.set.argsForCall.length).toBe(0);
          });
          return it('calls HashDelegate.set() with previous hash for context', function() {
            Nav.goTo('test');
            expect(mHashDelegate.get()).toBe('ctx1!test');
            Nav.goTo('test2');
            expect(mHashDelegate.get()).toBe('ctx1!test2');
            Nav.goBack();
            expect(mHashDelegate.get()).toBe('ctx1!test');
            Nav.goBack();
            expect(mHashDelegate.get()).toBe(mInitialHash);
            mHashDelegate.set.reset();
            Nav.goBack();
            expect(mHashDelegate.get()).toBe(mInitialHash);
            return expect(mHashDelegate.set).not.toHaveBeenCalled();
          });
        });
        describe('Nav.goTo(urlPath:string)', function() {
          var mUrlPath;
          mUrlPath = "one/two/three?key1=val1&key2=val2";
          beforeEach(function() {
            return Nav.goTo(mUrlPath);
          });
          return it('calls HashDelegate.set("#{current context}!#{urlpath}")', function() {
            return expect(mHashDelegate.set).toHaveBeenCalledWith("" + mAppConfig.defaultContext + "!" + mUrlPath);
          });
        });
        describe('Nav.parseHash(hash:string)', function() {
          var itParses;
          itParses = function(hashes, expected) {
            var h, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = hashes.length; _i < _len; _i++) {
              h = hashes[_i];
              _results.push((function(h) {
                var e, k, v, _ref;
                e = {};
                for (k in expected) {
                  v = expected[k];
                  e[k] = v;
                }
                if ((_ref = e.hash) == null) e.hash = h;
                return it("parses '" + h + "' to " + (JSON.stringify(e)), function() {
                  return expect(Nav.parseHash(h)).toEqual(e);
                });
              })(h));
            }
            return _results;
          };
          itParses(['', '#', '#!', '#?', '#!?', '#!/', '#!/?', '#!ignore/me?because=no&context=specified'], {
            context: 'ctx1',
            page: 'path1',
            data: {}
          });
          itParses(['#/', '#/!/', '#/!ignore-me-cause-Im-a-directory/'], {
            context: 'ctx1',
            page: 'path1',
            data: {}
          });
          itParses(["#ctx1", '#ctx1!', '#ctx1!/?', '#badContextThatWillBeDefaulted!/?'], {
            context: 'ctx1',
            page: 'path1',
            data: {}
          });
          itParses(['#ctx2!a/b-c/d_ef/_gh/-ijk', '#ctx2!a/b-c/d_ef/_gh/-ijk?'], {
            context: 'ctx2',
            page: 'a/b-c/d_ef/_gh/-ijk',
            data: {}
          });
          return itParses(['#ctx1!a/b-c/d_ef/_gh/-ijk?w=val&x=0&y=Krusty%20the%20Clown&z=Sam%20I%20Am'], {
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
        describe('Nav.toHash({context,page,data})', function() {
          it('"##{AppConfig.defaultContext}!#{defaultPagePath}, when passed unknown OR no context', function() {
            var ctx;
            return expect(Nav.toHash({})).toBe("#" + (ctx = mAppConfig.defaultContext) + "!" + mAppConfig.contexts[ctx].defaultPagePath);
          });
          it('uses AppConfig.contexts[context].defaultPagePath when given unknown OR no page', function() {
            expect(Nav.toHash({
              context: 'ctx1'
            })).toBe("#ctx1!" + mAppConfig.contexts.ctx1.defaultPagePath);
            return expect(Nav.toHash({
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
            return expect(Nav.toHash(input)).toBe("#ctx2!a/b/c?d=e&f=g");
          });
        });
        describe('HashDelegate.onChange handler', function() {
          var binds, hash;
          hash = '#ctx1!testpage?a=b&c=d';
          binds = null;
          beforeEach(function() {
            currentHash = hash;
            return Nav.bind(spyOnAll(binds = {
              'change:current': function() {},
              'change:current[context=ctx1]': function() {}
            }));
          });
          it("When the hash is the same, doesn't update or trigger 'change:current'/'change:current[context=ctx1]' events", function() {
            NavOnChange();
            expect(binds['change:current'].argsForCall.length).toBe(1);
            NavOnChange();
            expect(binds['change:current'].argsForCall.length).toBe(1);
            return expect(binds['change:current[context=ctx1]'].argsForCall.length).toBe(1);
          });
          describe('[Back button] When the hash changes to the previous hash in the context history', function() {
            var prevHash;
            prevHash = void 0;
            beforeEach(function() {
              prevHash = Nav.current;
              currentHash = '#ctx1!testpage?a=b&c=d';
              NavOnChange();
              currentHash = mInitialHash;
              return NavOnChange();
            });
            it('updates Nav.current', function() {
              return expect(Nav.current).toBe(prevHash);
            });
            it('triggers "change:current" event, with {data:{isBack:true}}', function() {
              return expect(binds['change:current']).toHaveBeenCalledWith({
                cur: prevHash,
                prev: new Model({
                  hash: hash,
                  context: 'ctx1',
                  page: 'testpage',
                  data: {
                    a: 'b',
                    c: 'd'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current',
                data: {
                  isBack: true,
                  isContextSwitch: false
                }
              });
            });
            return it('triggers "change:current[context=ctx1]" event, with {data:{isBack:true}}', function() {
              return expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith({
                cur: prevHash,
                prev: new Model({
                  hash: hash,
                  context: 'ctx1',
                  page: 'testpage',
                  data: {
                    a: 'b',
                    c: 'd'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current[context=ctx1]',
                data: {
                  isBack: true,
                  isContextSwitch: false
                }
              });
            });
          });
          return describe('When the hash changes', function() {
            beforeEach(function() {
              return NavOnChange();
            });
            it('updates Nav.current', function() {
              return expect(Nav.current).toEqual(new Model({
                hash: hash,
                context: 'ctx1',
                page: 'testpage',
                data: {
                  a: 'b',
                  c: 'd'
                }
              }));
            });
            it('triggers "change:current" event', function() {
              return expect(binds['change:current']).toHaveBeenCalledWith({
                cur: new Model({
                  hash: hash,
                  context: 'ctx1',
                  page: 'testpage',
                  data: {
                    a: 'b',
                    c: 'd'
                  }
                }),
                prev: new Model({
                  hash: mInitialHash,
                  context: 'ctx1',
                  page: 'a/b-c/d_ef/_gh/-ijk',
                  data: {
                    w: 'val',
                    x: '0',
                    y: 'Krusty the Clown',
                    z: 'Sam I Am'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current',
                data: {
                  isBack: false,
                  isContextSwitch: false
                }
              });
            });
            return it('triggers "change:current[context=ctx1]" event', function() {
              return expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith({
                cur: new Model({
                  hash: hash,
                  context: 'ctx1',
                  page: 'testpage',
                  data: {
                    a: 'b',
                    c: 'd'
                  }
                }),
                prev: new Model({
                  hash: mInitialHash,
                  context: 'ctx1',
                  page: 'a/b-c/d_ef/_gh/-ijk',
                  data: {
                    w: 'val',
                    x: '0',
                    y: 'Krusty the Clown',
                    z: 'Sam I Am'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current[context=ctx1]',
                data: {
                  isBack: false,
                  isContextSwitch: false
                }
              });
            });
          });
        });
        return describe('Nav.switchContext(contextId:string)', function() {
          var binds;
          binds = null;
          beforeEach(function() {
            return Nav.bind(spyOnAll(binds = {
              'change:current': function() {},
              'change:current[context=ctx1]': function() {},
              'change:current[context=ctx2]': function() {}
            }));
          });
          it('does nothing when contextId is not valid context (not part of AppConfig.contexts)', function() {
            Nav.switchContext('bogus context');
            expect(binds['change:current']).not.toHaveBeenCalled();
            return expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled();
          });
          it('does nothing when contextId is not a string, undefined, or null', function() {
            Nav.switchContext(void 0);
            Nav.switchContext(null);
            Nav.switchContext(5);
            Nav.switchContext({});
            expect(binds['change:current']).not.toHaveBeenCalled();
            return expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled();
          });
          describe('When switching to a new context (ctx2)', function() {
            beforeEach(function() {
              return Nav.switchContext('ctx2');
            });
            it('updates Nav.current', function() {
              return expect(Nav.current).toEqual(new Model({
                hash: '#ctx2!path2',
                context: 'ctx2',
                page: 'path2',
                data: {}
              }));
            });
            it('does NOT trigger "change:current[context=ctx1]" event', function() {
              return expect(binds['change:current[context=ctx1]']).not.toHaveBeenCalled();
            });
            it('triggers "change:current" event', function() {
              return expect(binds['change:current']).toHaveBeenCalledWith({
                cur: new Model({
                  hash: '#ctx2!path2',
                  context: 'ctx2',
                  page: 'path2',
                  data: {}
                }),
                prev: new Model({
                  hash: mInitialHash,
                  context: 'ctx1',
                  page: 'a/b-c/d_ef/_gh/-ijk',
                  data: {
                    w: 'val',
                    x: '0',
                    y: 'Krusty the Clown',
                    z: 'Sam I Am'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current',
                data: {
                  isBack: false,
                  isContextSwitch: true
                }
              });
            });
            return it('triggers "change:current[context=ctx2]" event', function() {
              return expect(binds['change:current[context=ctx2]']).toHaveBeenCalledWith({
                cur: new Model({
                  hash: '#ctx2!path2',
                  context: 'ctx2',
                  page: 'path2',
                  data: {}
                }),
                prev: new Model({
                  hash: mInitialHash,
                  context: 'ctx1',
                  page: 'a/b-c/d_ef/_gh/-ijk',
                  data: {
                    w: 'val',
                    x: '0',
                    y: 'Krusty the Clown',
                    z: 'Sam I Am'
                  }
                }),
                model: Nav,
                property: 'current',
                type: 'change:current[context=ctx2]',
                data: {
                  isBack: false,
                  isContextSwitch: true
                }
              });
            });
          });
          return describe('When switching to a previously context (ctx1)', function() {
            var lastCtx1Hash, lastCtx2Hash;
            lastCtx1Hash = void 0;
            lastCtx2Hash = void 0;
            beforeEach(function() {
              Nav.goTo('goSomewhere?x=5&y=6&z=7');
              lastCtx1Hash = Nav.current;
              Nav.switchContext('ctx2');
              lastCtx2Hash = Nav.current;
              binds['change:current[context=ctx1]'].reset();
              binds['change:current[context=ctx2]'].reset();
              return Nav.switchContext('ctx1');
            });
            it('updates Nav.current with last hash of the previously visited context', function() {
              return expect(Nav.current).toBe(lastCtx1Hash);
            });
            it('does trigger "change:current[context=ctx1]" event', function() {
              return expect(binds['change:current[context=ctx1]']).toHaveBeenCalledWith({
                cur: new Model(lastCtx1Hash),
                prev: new Model(lastCtx2Hash),
                model: Nav,
                property: 'current',
                type: 'change:current[context=ctx1]',
                data: {
                  isBack: false,
                  isContextSwitch: true
                }
              });
            });
            return it('does NOT trigger "change:current[context=ctx2]" event', function() {
              return expect(binds['change:current[context=ctx2]']).not.toHaveBeenCalled();
            });
          });
        });
      };
    })(mInitialHash));
  };
});
