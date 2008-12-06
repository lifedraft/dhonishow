
(function(){
  var preloader = DhoniShow.register("preloader", function() {
    this.addEventListener("loadedImagedElement", this, this.loadedImagedElement);
    this.addEventListener("loaded", this, function(){}, true);
    this.addEventListener("afterTemplate", this, this.templateBaseReady, true);
  });

  preloader.prototype = {
    templateBaseReady: function(){
      var _this = this;

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

              images[i].onload = function(){
                var imageIndex = i;
                // TODO i wird immer images.length-1 sein. Warum den wohl?
                _this.dispatchEvent("loadedImagedElement", images.length-1, allImagesLoaded++, this, imageIndex, index);
              };
            }

          }
        } else {
          throw("No images set");
        }
      });
    },
    
    loadedImagedElement: function(totalImages, loadedImages, image, currentImageIndex, currentElementIndex) {
      var dimensions = this.share("elements")[currentElementIndex].children[currentImageIndex];
      dimensions.width = image.width;
      dimensions.height = image.height;

      if(totalImages == loadedImages){
        this.loadedElements--;
        this.dispatchEvent("loadedOne");
        if(this.loadedElements < 1){
          this.dispatchEvent("loaded");
        }
      }
    }
  };
})();