var DhoniShow = function(element, options, index){
  var Class = new DhoniShow.Class(this);

  this.options = jQuery.extend(this.options, new this.options(element.className), options);
  this.share = {
    element: jQuery(element),
    current: 0
  };
  this.event = new DhoniShow.event();
  
  for(var module in this.modules) {
    
    // alias options implementation
    if(this.options_aliases[module] && this.options[module]) {
      for (var i=0; i < this.options_aliases[module].length; i++) {
        if(this.options[this.options_aliases[module][i]]){
          jQuery.extend(this.options[module], this.options[this.options_aliases[module][i]]);
        }
      };
    }
    
    jQuery.extend(this.modules[module].prototype, Class, { options: this.options[module] });
    new this.modules[module]();
  }
};

DhoniShow.prototype = {
  modules: {},
  options: {},
  options_aliases: {}
};

DhoniShow.event = function(){};

DhoniShow.event.prototype = {
  addEventListener: function(event, scope, method, notrepeatable /*, n args */) {
    if(!(event in this.events)) this.events[event] = [];
    
    /*
    * notrepeatable == one time executed
    */
    if(!(event in this.notrepeatable) && notrepeatable) this.notrepeatable[event] = false;

    var args = []; for (var i = 3; i < arguments.length; i++) args.push(arguments[i]);

    /**
    * If this.notrepeatable[event] property is already set to true, than 
    * dispatchEvent(event) was already called and now we get ride of the already 
    * executed triggers
    */
    
    if(notrepeatable && this.notrepeatable[event]) this.events[event] = [];

    this.events[event].push({
      method: method,
      scope: scope,
      args: args
    });

    if(notrepeatable && this.notrepeatable[event]) this.dispatchEvent(event);
  },

  dispatchEvent: function(event /*, n args */) {
    if(!(event in this.events)) return false;
    if(event in this.notrepeatable) this.notrepeatable[event] = true;

    var _args = []; for (var i = 1; i < arguments.length; i++) _args.push(arguments[i]);

    for (var i=0; i < this.events[event].length; i++) {
      var eventScope = this.events[event][i];

      if(arguments.length > 1) { var args = [].concat(eventScope.args).concat(_args); }

      eventScope.method.apply(eventScope.scope, args || eventScope.args);
    }
  },
  events: {},
  notrepeatable: {}
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
  },
  share: function(key, value){
    if(value != undefined) {
      return this.parent.share[key] = value;
    }
    
    return this.parent.share[key];
  }
};

DhoniShow.path = function(path, destination) {
  path = path.split(".");
  
  if(path.length > 0) {
    for (var i=0; i < path.length; i++) {
      if(i != path.length-1) {
        if(!(path[i] in destination)) destination[path[i]] = {};
        destination = destination[path[i]];
      } else {
      }
    };
  }
  
  return {
    destination: destination,
    name: path.length > 0 ? path[path.length-1] : path
  };
};

DhoniShow.register = function(name, method, options, aliases) {
  var path = this.path(name, this.prototype.modules);
  
  path.destination[path.name] = method;
  
  if(options && path.destination == this.prototype.modules){
    this.prototype.options[name] = options;
    if(aliases) this.prototype.options_aliases[name] = aliases;
  }
  
  return path.destination[path.name];
};