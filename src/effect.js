(function(){
  
  var effect = DhoniShow.register("effect", function(parent){
    this.parent = parent;
    
    var Class = new this.Class();

    jQuery.extend(this.effects[this.options.name].prototype, Class, { options: this.options });
    new this.effects[this.options.name](this);
    
  }, {
    name: "appear",
    duration: 0.6
  });
  
  effect.prototype = {};
  
  effect.prototype.Class = function(){};
  
  effect.prototype.Class.prototype = {
    addEventListener: function(){
      this.parent.parent.event.addEventListener.apply(this.parent.parent.event, arguments);
    },
    dispatchEvent: function(){
      this.parent.parent.event.dispatchEvent.apply(this.parent.parent.event, arguments);
    }
  };

})();