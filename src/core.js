var DhoniShow = function(element, options, index){
  var Class = new DhoniShow.Class(this);

  this.options = jQuery.extend(this.options, new this.options(element.className), options);
  this.share = {
    element: element
  };
  
  for(var module in this.modules) {
    jQuery.extend(this.modules[module].prototype, Class, { options: this.options[module] });
    new this.modules[module]();
  }
};

DhoniShow.prototype = {
  modules: {},
  event: {
    addEventListener: function(event, scope, method /*, n args */) {
      if(!(event in this.events)) this.events[event] = [];

      var args = []; for (var i = 3; i < arguments.length; i++) args.push(arguments[i]);

      this.events[event].push({
        method: method,
        scope: scope,
        args: args
      });
    },

    dispatchEvent: function(event /*, n args */) {
      if(!(event in this.events)) return false;

      var _args = []; for (var i = 1; i < arguments.length; i++) _args.push(arguments[i]);

      for (var i=0; i < this.events[event].length; i++) {
        var eventScope = this.events[event][i];

        if(arguments.length > 1) { var args = [].concat(eventScope.args).concat(_args); }

        eventScope.method.apply(eventScope.scope, args || eventScope.args);
      }
    },
    events: {}
  },
  options: {} 
};


DhoniShow.Class = function(parent){
  this.parent = parent;
};

DhoniShow.Class.prototype = {
  addEventListener: function(){
    this.parent.event.addEventListener.apply(this.parent.event, arguments);
  },
  dispatchEvent: function(){
    this.parent.event.dispatchEvent.apply(this.parent.event, arguments);
  }
};

DhoniShow.register = function(name, method, options) {
  this.prototype.modules[name] = method;
  
  if(options){ this.prototype.options[name] = options; }

  return this.prototype.modules[name];
};