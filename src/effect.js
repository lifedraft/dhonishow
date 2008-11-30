(function(){
  
  var effect = DhoniShow.register("effect", function(){
    var Class = new this.Class(this);
    
    jQuery.extend(this.effects[this.options.name].prototype, Class, { options: this.options });
    new this.effects[this.options.name]();
    
  }, {
    name: "appear",
    duration: 0.6
  });
  
  effect.prototype = {
    effects: {}
  };
  
  effect.prototype.Class = function(parent){
    this.parent = parent;
  };
  
  effect.prototype.Class.prototype = {
    addEventListener: function(){
      this.parent.parent.event.addEventListener.apply(this.parent.parent.event, arguments);
    },
    dispatchEvent: function(){
      this.parent.parent.event.dispatchEvent.apply(this.parent.parent.event, arguments);
    }
  };


  var appear = DhoniShow.register("effect.prototype.effects.appear", function(){
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
  });

  appear.prototype = {
    update: function(current, next) {
      var elements = this.parent.share("dimensions");
      elements[current].element.animate({ opacity: "toggle" }, this.options.duration*1000);
      elements[next].element.animate({ opacity: "toggle" }, this.options.duration*1000);
    },
    
    center: function() {
      this.parent.share("element").css("width", this.parent.share("width")+"px");
      var elements = this.parent.share("dimensions");
      var currenIndex = this.parent.share("current");
      
      for (var i=0; i < elements.length; i++) {
        elements[i].element.css(elements[i].dimensions).css("height", this.parent.share("height"));
        if(i != currenIndex) elements[i].element.hide();
      };
    }
  };
  
})();