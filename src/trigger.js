(function(){
  
  var trigger = DhoniShow.register("trigger", function(){
    this.addEventListener("loaded", this, this.addListeners, true);
  });
  
  trigger.prototype = {

    addListeners: function(){
      this.delegate("click", "next", this.next);
      this.delegate("click", "previous", this.previous);
    },
    
    next: function(element){
      var current = this.share("current");
      this.dispatchEvent("update", current, this.share("current", ++current));
    },
    
    previous: function(element){
      var current = this.share("current");
      this.dispatchEvent("update", current, this.share("current", --current));
    },

    events: {},
    delegate: function(event, className, func, target){
      this.bind(event, target || this.share("element"));
      if(!(event in this.events)) this.events[event] = {};
      this.events[event][className] = func;
    },
    
    bind: function(event, target){
      var _this = this;
      if(!(event in this.events)) {
        target.bind(event, (function(){
          return function(){
            return _this.event.apply(_this, arguments);
        };})());
      }
    },
    
    event: function(event){
      var triggers = this.events[event.type];
      var classNames = event.target.className.split(" ");
      for (var i=0; i < classNames.length; i++) {
        if(classNames[i] in triggers){
          triggers[classNames[i]].call(this, event.target);
        }
      };
    }

  };
  
})();