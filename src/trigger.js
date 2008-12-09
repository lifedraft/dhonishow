(function(){
  
  var trigger = DhoniShow.register("trigger", function(parent) {
    this.parent = parent;
    
    this.share("trigger", this);
    this.addEventListener("loaded", this, this.addListeners, true);
  }, {
    endless: true,
    mixins: ["paging"]
  });
  
  trigger.prototype = {

    addListeners: function() {
      this.delegate("click", "next", this.next);
      this.delegate("click", "previous", this.previous);
    },
    
    next: function(element, next, parent) {
      var current = this.share("current");
      var total = this.share("elements").length;

      if(next || next == 0) {
        next = next;
      } else if(!(current+1 < total) && this.options.endless) {
        next = 0;
      } else if (current+1 < total) {
        next = current+1;
      }
      this.dispatchEvent("update", current, this.share("current", next));
    },
    
    previous: function(element, next) {
      var current = this.share("current");
      var total = this.share("elements").length;
      
      if(next || next == 0) {
        next = next;
      } else if(!(current > 0) && this.options.endless) {
        next = total-1;
      } else if(current > 0) {
        next = current-1;
      }
      
      this.dispatchEvent("update", current, this.share("current", next));
    },

    delegate: function(event, className, func, target) {
      if(!this.events) this.events = {};
      this.bind(event, target || this.share("element"));
      if(!(event in this.events)) this.events[event] = {};
      this.events[event][className] = func;
    },
    
    bind: function(event, target) {
      var _this = this;
      this._this = this;
      if(!(event in this.events)) {
        target.bind(event, (function() {
          return function() {
            return _this.event.apply(_this, arguments);
        };})());
      }
    },
    
    event: function(event) {
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