var __slice = Array.prototype.slice;
define(function() {
  var bus;
  bus = $(document.createElement('div'));
  return {
    trigger: function(ev) {
      return bus.trigger(ev);
    },
    one: function(type, cb) {
      return bus.one(type, cb);
    },
    bind: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return bus.bind.apply(bus, args);
    },
    unbind: function(type, cb) {
      if (typeof cb === 'function') {
        return bus.unbind(type, cb);
      }
    }
  };
});