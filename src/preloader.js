/*
  Allowed element structures:
  
  <div class="dhonishow">
    <img src="#" />
    <img src="#" />
    <img src="#" />
  </div>
  
  <ol class="dhonishow">
    <li><img src="#" /></li>
    <li><img src="#" /></li>
    <li><img src="#" /></li>
  </ol>
  
  <ul class="dhonishow">
    <li><img src="#" /></li>
    <li><img src="#" /></li>
    <li><img src="#" /></li>
  </ul>

  <div class="dhonishow">
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
  </div>
  
*/

(function(){
  var preloader = DhoniShow.register("preloader", function(){
    var _this = this;
    
    var dimensions = this.parent.share.dimensions = [];
    
    var elements = this.parent.share.element.children();
    this.loadedElements = elements.length;
    this.addEventListener("loadedImagedElement", this, this.loadedImagedElement);

    elements.each(function(index, element) {
      dimensions[index] = {};

      var directChildrenImages = jQuery(this).filter("img").get();
      var childrenImages = jQuery(this).find("img").get();
      var images = directChildrenImages.concat(childrenImages);
      var allImagesLoaded = 0;


      if(images.length > 0) {
        for (var i=0; i < images.length; i++) {
          dimensions[index][i] = {
            width: 0,
            height: 0,
            image: images[i]
          };
          
          if(images[i].width > 0 && images[i].height > 0) {
            _this.dispatchEvent("loadedImagedElement", images.length-1, allImagesLoaded++, images[i], i, index);
          } else {
            
            images[i].onload = function(){
              var imageIndex = i;
              /*
                TODO i wird immer images.length-1 sein. Warum den wohl?
              */
              _this.dispatchEvent("loadedImagedElement", images.length-1, allImagesLoaded++, this, imageIndex, index);
            };
          }

        }
      } else {
        console.log("no images set");
      }
    });

  });

  preloader.prototype = {
    loadedImagedElement: function(totalImages, loadedImages, image, currentImageIndex, currentElementIndex) {
      var dimensions = this.parent.share.dimensions[currentElementIndex][currentImageIndex];
      dimensions.width = image.width;
      dimensions.height = image.height;
      
      if(totalImages == loadedImages){
        this.loadedElements--;
        this.dispatchEvent("loadedOne");
        if(!this.loadedElements) this.dispatchEvent("loaded");
      }
    }
  };
})();