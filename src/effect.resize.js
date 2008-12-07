(function(){
  
  var resize = DhoniShow.register("effect.prototype.effects.resize", function(){
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
  });
  
  resize.prototype = {
    update: function(current, next){
      var elements = this.parent.share("elements");
      var duration = this.options.duration*1000;
      elements[current].element.animate({ opacity: "toggle" }, duration);
      elements[next].element.animate({ opacity: "toggle" }, duration);

      this.parent.share("dimensionsWrapper").animate( { height: elements[next].dimensions.height }, duration );
      this.parent.share("element").animate( { width: elements[next].dimensions.width }, duration);
    },
    
    center: function(){
      var elements = this.parent.share("elements");
      var reversed = [].concat(elements).reverse(); // Ugly but we want to break the reference
      var current = this.parent.share("current");
      
      for (var i=0; i < reversed.length; i++) {
        reversed[i].element.css( "z-index", i + 1 );
        if(i != (reversed.length-1 - current)) reversed[i].element.hide();
      }
      
      this.parent.share("element").css("width", elements[current].dimensions.width);
      this.parent.share("dimensionsWrapper").css("height", elements[current].dimensions.height);
    }
  };
  
})();