(function(){
  var thumbnails = DhoniShow.register("thumbnails", function(){
    if(this.options.show) {
      this.addEventListener("loaded", this, this.loaded, true);
      this.addEventListener("update", this, this.update);
    }
  }, {
    cols: 4,
    gap: 10,
    show: false
  });
  
  thumbnails.prototype = {
    loaded: function() {
      this.elements = this.share("elements");
      this.thumbnailsWrapper = jQuery("<ol class='dhonishow_module_thumbnails-wrapper'></ol>");
      this.share("element").append(this.thumbnailsWrapper);
      this.insertElements();
      this.addEventListeners();
    },
    
    insertElements: function() {
      this.thumbnails = [];
      var elementWidthHeight = (this.share("element").width() - (this.options.gap * (this.options.cols - 1))) / this.options.cols;

      this.thumbnailsWrapper.css({
        marginBottom: -this.options.gap+"px"
      });
      
      for (var i=0; i < this.elements.length; i++) {
        var element = this.thumbnails[i] = this.elements[i].element.clone().removeClass("dhonishow_module_base-element")
        .addClass("dhonishow_module_thumbnails-element");
        
        element.children().wrapAll("<a rel='"+i+"' class='dhonishow_change'></a>");
        this.thumbnailsWrapper.append(element);
        var dimensions = this.elements[i].dimensions;

        element.css({
          width: elementWidthHeight,
          height: elementWidthHeight,
          marginBottom: this.options.gap,
          padding: 0,
          display: ""
        });
        
        if((i+1) % this.options.cols != 0){
         element.css({ marginRight: this.options.gap }) 
        }
      };

    },
    
    addEventListeners: function() {
      var _this = this;
      this.thumbnailsWrapper.find("a.dhonishow_change").bind("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        _this.share("trigger").next({}, Number(jQuery(this).attr("rel")));
        return false;
      })
    },
    
    update: function(current, next) {
      this.thumbnails[current].removeClass("thumbnail_active");
      this.thumbnails[next].addClass("thumbnail_active");
    }
  };
  
})();