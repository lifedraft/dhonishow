(function(){
  var gestures = DhoniShow.register("gestures", function(parent){
    this.parent = parent;
    
    this.width = this.share("width");
    this.height = this.share("height");
    this.origin = 0;
    this.startX = 0;
    this.startY = 0;
    
    if(this.options.name != "slide") return;
    
    this.direction = this.options.slide.direction;

    if(navigator.userAgent.indexOf("iPhone") != -1){
      this.addEventListener("loaded", this, this.iphone, true);
    } else {
      this.addEventListener("loaded", this, this.desktop, true);
    }
    
  }, {
    enable: true,
    mixins: ["effect"]
  });
  
  gestures.prototype = {
    touchstart: function(startX, startY){ // mousedown
      this.moving = false;
      this.startX = startX;
      this.startY = startY;
      
      if(isNaN(this.origin = Number(this.share("dimensionsWrapper").css(this.direction).split("px")[0]))) 
        this.origin = 0;
      
      return false;
    },
    touchmove: function(endX, endY){ // mousemove
      this.moving = true;
      this.endX = endX;
      this.endY = endY;
      
      switch(this.options.slide.direction) {
        case "left":
          this.share("dimensionsWrapper").css("left", this.origin+(this.endX-this.startX));
        break;
        case "top":
          this.share("dimensionsWrapper").css("top", this.origin+(this.endY-this.startY));
        break;
        case "right":
          this.share("dimensionsWrapper").css("right", this.origin+(this.startX-this.endX));
        break;
        case "bottom":
          this.share("dimensionsWrapper").css("bottom", this.origin+(this.startY-this.endY));
        break;
      }
      
      
      return false;
    },
    touchend: function(){ // mouseup
      if(!this.moving) return;
      this.moving = false;
      var offsetX = this.endX-this.startX;
      var offsetY = this.endY-this.startY;
      
      var factorX = this.width/16;
      var factorY = this.height/16;

      if(offsetX < 0) offsetX = -offsetX;
      if(offsetY < 0) offsetY = -offsetY;
      
      if(this.options.slide.direction == "left" || this.options.slide.direction == "right") {
        if(this.endX < this.startX && offsetX >= factorX) { // right to left 
          this.options.slide.direction == "left" ? this.share("trigger").next() : this.share("trigger").previous();
        } else if(offsetX >= factorX) { // left to right 
          this.options.slide.direction == "right" ? this.share("trigger").next() : this.share("trigger").previous();
        } else {
          this.share("dimensionsWrapper").css(this.options.slide.direction, this.origin);
        }
      }
      
      if(this.options.slide.direction == "top" || this.options.slide.direction == "bottom") {
        if(this.endY < this.startY && offsetY >= factorY) { // top to bottom 
          this.options.slide.direction == "top" ? this.share("trigger").next() : this.share("trigger").previous();
        } else if(offsetY >= factorY) { // bottom to top 
          this.options.slide.direction == "bottom" ? this.share("trigger").next() : this.share("trigger").previous();
        } else {
          this.share("dimensionsWrapper").css(this.options.slide.direction, this.origin);
        }
      }

      this.startX = 0;
      this.startY = 0;
    },
    
    iphone: function() {
      var _this = this;
      var element = this.share("element")[0];
      
      element.ontouchstart = function(event) {
        if(event.touches.length == 1) {
          var target = event.touches[0];
          return _this.touchstart(target.pageX, target.pageY);
        }
      };
      
      element.ontouchmove = function(event) {
        if(event.touches.length == 1) {
          _this.touchmove(event.touches[0].pageX, event.touches[0].pageY);
        }
      };
      
      element.ontouchend = function(event) {
        _this.touchend();
      };
    },
    
    desktop: function(){
      var element = this.share("element");
      var _this = this;
      var active = false;
      
      element.bind("mousedown", function(event){
        active = true;
        return _this.touchstart(event.pageX, event.pageY);
      });
      
      element.bind("mousemove", function(event){
        if(active) {
          return _this.touchmove(event.pageX, event.pageY);
        }
      });
      
      element.bind("mouseout", function(event){
        if(active) jQuery(this).trigger("mouseup");
      });
      
      element.bind("mouseup", function(event){
        if(active){          
          active = false;
          _this.touchend();
        }
      });
    }
  }
})();