(function(){
  
  var scroll = DhoniShow.register("effect.prototype.effects.scroll", function(parent){
    this.parent = parent;
    
    this.themehelper = this.share("dimensionsWrapper").wrapAll("<div class='dhonishow-module-effect_scroll-themehelper'></div>").parent();
        
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
  }, {
    cols: 2
  });

  scroll.prototype = {
    update: function(current, next) {
      var elements = this.parent.share("elements");

      this.share("dimensionsWrapper").animate({
        left: -elements[next].offsets.left,
        top: -elements[next].offsets.top
      }, this.options.duration*1000, this.easing(this.options.easing));
    },
    
    center: function() {
      var elements = this.share("elements");
      var cols = this.options.scroll.cols;
      var rows = Math.ceil(elements.length / cols);
      
      var dimensions = this.dimensions = {
        width: this.share("width"),
        height: this.share("height")
      };

      this.share("element").css("width", dimensions.width);
      this.themehelper.css({width: dimensions.width, height: dimensions.height});      
      this.share("dimensionsWrapper").css({
        width: dimensions.width*cols,
        height: dimensions.height*rows,
        left: 0,
        top: 0
      });
      
      var xOffset = 0;
      var yOffset = 0;
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i].element;
        
        if((i+1) % cols != 0 && i != 0) {
          xOffset = 0;
          yOffset += dimensions.height;
        } else if( i != 0 ){
          xOffset += dimensions.width;
        }
        
        elements[i].offsets.left = xOffset;
        elements[i].offsets.top = yOffset;
        element.css(elements[i].offsets);
      };

    }
  };
  
})();