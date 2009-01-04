
(function() {
  var preloader = DhoniShow.register("preloader", function(parent) {
    this.parent = parent;
    
    this.addEventListener("loadedImagedElement", this, this.loadedImagedElement);
    this.addEventListener("loaded", this, this.hideLoading, true);
    this.addEventListener("afterTemplate", this, this.templateBaseReady, true);
  }, {
    show: true
  });

  preloader.prototype = {
    templateBaseReady: function(){
      var _this = this;

      if(this.options.show) this.createLoading();
      this.loadedElements = this.share("elements").length;
      this.share("element").css("width", this.share("element").width());
      
      jQuery.each(this.share("elements"), function(index, element) {
        
        var domElement = jQuery(element.element);
        element.children = [];

        var childrenElements = domElement.find("*").length;

        
        var images = domElement.find("img").get();
        var allImagesLoaded = 0;

        if(images.length > 0) {
          element.dimensions = { width: domElement.width(), height: domElement.height()};
          
          if(childrenElements != images.length) {
            domElement.removeClass("dhonishow-module_base-element").addClass("dhonishow-module_base-image-text-element");
          }
          
          for (var i=0; i < images.length; i++) {
            element.children[i] = {
              width: 0,
              height: 0,
              image: images[i]
            };

            if(images[i].width > 0 && images[i].height > 0) {
              _this.dispatchEvent("loadedImagedElement", images.length-1, allImagesLoaded++, images[i], i, index);
            } else {
              var src = images[i].src;
              images[i].src = "";
              var imageIndex = i;
              images[i].onload = function() {
                _this.dispatchEvent("loadedImagedElement", images.length-1, allImagesLoaded++, this, imageIndex, index);
              };
              images[i].src = src;
            }
          }
        } else {
          domElement.removeClass("dhonishow-module_base-element").addClass("dhonishow-module_base-text-element");
          element.dimensions = { width: domElement.width(), height: domElement.height()};
          _this.loadedTextElement();
        }
      });
    },
    
    loadedImagedElement: function(totalImages, loadedImages, image, currentImageIndex, currentElementIndex) {
      var dimensions = this.share("elements");
      dimensions[currentElementIndex].children[currentImageIndex].width = image.width;
      dimensions[currentElementIndex].children[currentImageIndex].height = image.height;
      var wrapperElement = dimensions[currentElementIndex].element;
      dimensions[currentElementIndex].dimensions.width = wrapperElement.width();
      dimensions[currentElementIndex].dimensions.height = wrapperElement.height();
      
      this.share("elements", dimensions);

      if(totalImages == loadedImages){
        this.loadedElements--;
        this.dispatchEvent("loadedOne");
        if(this.loadedElements < 1){
          this.dispatchEvent("loaded");
        }
      }
    },
    
    loadedTextElement: function(){
      this.loadedElements--;
      this.dispatchEvent("loadedOne");
      if(this.loadedElements < 1) {
        this.dispatchEvent("loaded");
      }
    },
    
    createLoading: function() {
      this.loading = this.share("element").prev('.dhonishow_module-preloader');
    },
    
    hideLoading: function() {
      if(this.loading){
        this.loading.fadeOut(1000);
      }
      
      this.share("element").css({
        position: "relative",
        top: 0,
        left: 0
      });
      
    }
  };
})();