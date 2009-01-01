(function(){
  
  var slide = DhoniShow.register("effect.prototype.effects.slide", function(parent){
    this.parent = parent;

    if(this.options.slide.direction == "left") {
      this.updateHelper = { dimension: "width", side: "left", position: "left", prefix: "" };
    } else if (this.options.slide.direction == "top") {
      this.updateHelper = { dimension: "height", side: "top", position: "top", prefix: ""};
    } else if (this.options.slide.direction == "right") {
      this.updateHelper = { dimension: "width", side: "right", position: "left", prefix: "-" };
    } else if (this.options.slide.direction == "bottom") {
      this.updateHelper = { dimension: "height", side: "bottom", position: "top", prefix: "-" };
    }
    
    this.themehelper = this.share("dimensionsWrapper").wrapAll("<div class='dhonishow-module-effect_slide-themehelper'></div>").parent();
    
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
    this.parent.share("slide", this);
    
  }, {
    direction: "left"
  });
  
  slide.prototype = {
    update: function(current, next) {
      
      var total = this.share("elements").length-1;
      var _this = this;
      var css = {};
      
      if(total == next && current == 0) {
        css[this.updateHelper.side] = this.share(this.updateHelper.dimension);
        
        var complete = function(){
          var css = {};
          css[_this.updateHelper.side] = -(_this.share(_this.updateHelper.dimension) * next);
          jQuery(this).css(css);
        };
        
      } else if(next == 0 && current == total) {
        css[this.updateHelper.side] = -((this.share(this.updateHelper.dimension) * current) + this.share(this.updateHelper.dimension));
        
        var complete = function() {
          var css = {};
          css[_this.updateHelper.side] = 0;
          jQuery(this).css(css);
        };
        
      } else {
        css[this.updateHelper.side] = -(this.share(this.updateHelper.dimension) * next);
        var complete = function(){};
      }
      
      this.share("dimensionsWrapper").animate(css, this.options.duration*1000, this.easing(this.options.easing), complete);
    },
    
    center: function() {
      var elements = this.share("elements");
      
      var dimensions = this.dimensions = {
        width: this.share("width"),
        height: this.share("height")
      };

      this.share("element").css("width", dimensions.width);
      
      var dimensionsWrapperCSS = {};
      if(this.updateHelper.dimension == "width") {
        dimensionsWrapperCSS.width = dimensions.width*this.share("elements").length;
        dimensionsWrapperCSS.height = dimensions.height;
      } else {
        dimensionsWrapperCSS.width = dimensions.width;
        dimensionsWrapperCSS.height = dimensions.height*this.share("elements").length;
      }      
      this.share("dimensionsWrapper").css(dimensionsWrapperCSS);
      this.themehelper.css({width: dimensions.width, height: dimensions.height});
      
      var currenIndex = this.share("current");
      var offset = 0;
      
      for (var i=0; i < elements.length; i++) {
        var css = {
          paddingLeft: elements[i].offsets.paddingLeft,
          paddingTop: elements[i].offsets.paddingTop,
          marginLeft: elements[i].offsets.marginLeft,
          marginTop: elements[i].offsets.marginTop
        };
        css[this.updateHelper.position] = (this.updateHelper.prefix == "-") ? -offset : offset;
        elements[i].element.css(css);
        offset += dimensions[this.updateHelper.dimension];
      };
      
      if(this.options.endless) {
        var first = elements[0].element.clone();
        elements[elements.length-1].element.after(first);
        first.css(this.updateHelper.position, (this.updateHelper.prefix == "-") ? -offset : offset);

        var last = elements[elements.length-1].element.clone();
        elements[0].element.before(last);
        last.css(this.updateHelper.position, (this.updateHelper.prefix == "-") ? dimensions[this.updateHelper.dimension] : -dimensions[this.updateHelper.dimension]);
      }
    }
  };
})();