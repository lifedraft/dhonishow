
(function() {
  var preloader = DhoniShow.register("preloader", function() {
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
        element.dimensions = { width: domElement.width(), height: domElement.height()};
        element.children = [];

        var directChildrenImages = domElement.filter("img").get();
        var childrenImages = domElement.find("img").get();
        var images = directChildrenImages.concat(childrenImages);
        var allImagesLoaded = 0;


        if(images.length > 0) {
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
          throw("No images set");
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
    
    createLoading: function() {
      this.loading = this.share("element").before('<div class="dhonishow_module_preloader"></div>').prev();
    },
    
    hideLoading: function() {
      if(this.loading){
        this.loading.fadeOut(1000);
      }
    }
  };
})();