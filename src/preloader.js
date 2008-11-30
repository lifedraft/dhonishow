
(function(){
  var preloader = DhoniShow.register("preloader", function(){
    this.addEventListener("loadedImagedElement", this, this.loadedImagedElement);
    this.addEventListener("loaded", this, function(){}, true);
    
    var _this = this;
    
    var dimensions = this.share("dimensions", []);
    var elements = this.share("element").children();
    this.loadedElements = elements.length;
    this.setInitialWidth(this.share("element"));
    
    elements.each(function(index, element) {
      var element = jQuery(element);
      dimensions[index] = {
        element: element,
        dimensions: { width: element.width(), height: element.height()},
        children: []
      };

      var directChildrenImages = jQuery(this).filter("img").get();
      var childrenImages = jQuery(this).find("img").get();
      var images = directChildrenImages.concat(childrenImages);
      var allImagesLoaded = 0;


      if(images.length > 0) {
        for (var i=0; i < images.length; i++) {
          dimensions[index].children[i] = {
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

  });

  preloader.prototype = {
    loadedImagedElement: function(totalImages, loadedImages, image, currentImageIndex, currentElementIndex) {
      var dimensions = this.share("dimensions")[currentElementIndex].children[currentImageIndex];
      dimensions.width = image.width;
      dimensions.height = image.height;

      if(totalImages == loadedImages){
        this.loadedElements--;
        this.dispatchEvent("loadedOne");
        if(this.loadedElements < 1){
          this.dispatchEvent("loaded");
        }
      }
    },
    
    setInitialWidth: function(element){
      element.css("width", element.width());
    }
  };
})();