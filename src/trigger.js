(function(){
  
  var trigger = DhoniShow.register("trigger", function(parent) {
    this.parent = parent;
    
    this.share("trigger", this);
    this.addEventListener("loaded", this, this.addListeners, true);
  }, {
    endless: true,
    keyboard: true,
    mixins: ["paging"]
  });
  
  trigger.prototype = {

    addListeners: function() {
      this.delegate("click", "next", this.next);
      this.delegate("click", "previous", this.previous);
      
      if(this.options.keyboard) this.keyboard();
    },
    
    keyboard: function() {
      var element = this.share("element")[0];
      var _this = this;
      
      this.keyboardActive = false;
      
      // source: http://ejohn.org/blog/comparing-document-position/
      var contains = function(a, b){
        return a.contains ?
          a != b && a.contains(b) :
          !!(a.compareDocumentPosition(b) & 16);
      }
      
      jQuery("body").bind("click", function(event){
        _this.keyboardActive = contains(element, event.target);
      });
      
      jQuery(document).bind("keyup", function(event){
        if(!_this.keyboardActive) return;
        
        switch(event.keyCode) {
          case 37: // left
            _this.previous();
          break;
          case 39: // right
            _this.next();
          break;
        }
      });
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