(function(){
  var thumbnails = DhoniShow.register("thumbnails", function(parent){
    this.parent = parent;
    if(this.options.show) {
      this.addEventListener("loaded", this, this.loaded, true);
      this.addEventListener("update", this, this.update);
    }
  }, {
    cols: 4,
    gap: 10,
    show: false,
    position: "after",
    center: true
  });
  
  thumbnails.prototype = {
    loaded: function() {
      this.elements = this.share("elements");
      
      this.ol = jQuery("<ol class='dhonishow-module_thumbnails'></ol>");
      this.wrapper = jQuery("<div class='dhonishow-module-thumbnails_wrapper'></div>");
      this.share("element").find(".dhonishow-module_base")[this.options.position](this.wrapper);
      this.wrapper.append(this.ol);
      
      this.insertElements();
      this.addEventListeners();
      this.update(this.share("current"), this.share("current"));
    },
    
    insertElements: function() {
      this.thumbnails = [];
      var dimension = (this.share("width") - (this.options.gap * (this.options.cols - 1))) / this.options.cols;
      
      var cols = this.options.cols;

      for (var i=0; i < this.elements.length; i++) {
        var element = this.thumbnails[i] = this.elements[i].element.clone().removeClass("dhonishow-module_base-element")
        .addClass("dhonishow_module_thumbnails-element");
        
        var children = element.children().wrapAll("<a rel='"+i+"' class='dhonishow_change'></a>");
        
        if(this.options.center) {
          var offsets = this.share("center").calculateOffsets(dimension, dimension, this.elements[i].dimensions.width, this.elements[i].dimensions.height);
          children.css(offsets);
        }
        
        children.before("<div class='dhonishow-thumbnails_marker'>Selected</div>");
        
        this.ol.append(element);
        var dimensions = this.elements[i].dimensions;

        element.css({
          width: dimension,
          height: dimension,
          marginBottom: this.options.gap,
          padding: 0,
          display: ""
        });
        
        if((i+1) % cols != 0) element.css({ marginRight: this.options.gap });

      };

    },
    
    addEventListeners: function() {
      var _this = this;
      this.wrapper.find("a.dhonishow_change").bind("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        _this.share("trigger").next({}, Number(jQuery(this).attr("rel")));
        return false;
      });
    },
        
    update: function(current, next) {
      this.thumbnails[current].removeClass("thumbnail_active");
      this.thumbnails[next].addClass("thumbnail_active");
    }
  };
  
})();