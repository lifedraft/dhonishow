(function(){
  
  var effect = DhoniShow.register("effect", function(parent){
    this.parent = parent;
    
    var Class = new this.Class();

    jQuery.extend(this.effects[this.options.name].prototype, Class, { options: this.options });
    new this.effects[this.options.name](this);
    
  }, {
    name: "appear",
    duration: 0.6,
    mixins: ["trigger"],
    // Easing Plugin should be included http://gsgd.co.uk/sandbox/jquery/easing/
    easing: "expo" // quad, cubic, quart, quint, sine, expo, circ, elastic, back, bounce
  });
  
  effect.prototype = {};
  
  effect.prototype.Class = function(){};
  
  effect.prototype.Class.prototype = {
    addEventListener: function(){
      this.parent.parent.event.addEventListener.apply(this.parent.parent.event, arguments);
    },
    dispatchEvent: function(){
      this.parent.parent.event.dispatchEvent.apply(this.parent.parent.event, arguments);
    },
    share: function(){
      return this.parent.share.apply(this.parent, arguments);
    },
    easing: function(string){
      if(string == "swing") return "swing";
      if(!jQuery.easing.easeInOutCubic || string == "linear") return "linear";
      return "easeInOut"+string[0].toUpperCase()+(string.substring(1).toLowerCase());
    }
  };

})();