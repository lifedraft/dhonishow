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
    
    this.themehelper = this.share("dimensionsWrapper").wrapAll("<div class='dhonishow_module_effect_slide-themehelper'></div>").parent();
    
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
    this.parent.share("slide", this);
    
  }, {
    direction: "left"
  });
  
  slide.prototype = {
    update: function(current, next) {
      var css = {};
      var offset = (this.share(this.updateHelper.dimension) * next);
      css[this.updateHelper.side] = -offset;
      this.share("dimensionsWrapper").animate(css, this.parent.duration*1000);
    },
    
    center: function() {
      var elements = this.share("elements");
      
      var dimensions = {
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
          paddingLeft: elements[i].dimensions.paddingLeft,
          paddingTop: elements[i].dimensions.paddingTop,
          marginLeft: elements[i].dimensions.marginLeft,
          marginTop: elements[i].dimensions.marginTop
        };
        css[this.updateHelper.position] = (this.updateHelper.prefix == "-") ? -offset : offset;
        elements[i].element.css(css);
        offset += dimensions[this.updateHelper.dimension];
      };
    }
  };
})();