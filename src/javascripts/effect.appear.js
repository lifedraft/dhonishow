(function(){
  
  var appear = DhoniShow.register("effect.prototype.effects.appear", function(parent){
    this.parent = parent;
    
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
  });

  appear.prototype = {
    update: function(current, next) {
      var elements = this.parent.share("elements");
      elements[current].element.animate({ opacity: "toggle" }, this.options.duration*1000, this.easing(this.options.easing));
      elements[next].element.animate({ opacity: "toggle" }, this.options.duration*1000, this.easing(this.options.easing));
    },
    
    center: function() {
      this.parent.share("element").css("width", this.parent.share("width")+"px");
      this.parent.share("dimensionsWrapper").css("height", this.parent.share("height"));
      var elements = this.parent.share("elements");
      var currenIndex = this.parent.share("current");
      
      for (var i=0; i < elements.length; i++) {
        elements[i].element.css(elements[i].offsets);
        if(i != currenIndex) elements[i].element.hide();
      };
    }
  };
  
})();