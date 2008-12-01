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
  
  // TODO Abstract this one and one in the template class
  
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

})();