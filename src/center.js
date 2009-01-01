(function(){
  
  var center = DhoniShow.register("center", function(parent){    
    this.parent = parent;
    this.share("center", this);
    
    this.elements = this.share("elements");
    this.max = { width: 0, height: 0 };
    
    this.addEventListener("loaded", this, this.center, true);
  }, {
    elements: true,
    fullwidth: false,
    width: "auto",
    height: "auto"
  });
  
  center.prototype = {
    center: function() {
      var elements = this.share("elements");
      for (var i=0; i < this.elements.length; i++) {
        var dimensions = elements[i].dimensions;
        if(this.max.width < dimensions.width) this.max.width = dimensions.width;
        if(this.max.height < dimensions.height) this.max.height = dimensions.height;
      };

      var width;
      if(this.options.fullwidth) {
        width = this.share("element").width();
      } else if(this.options.width != "auto") {
        width = this.options.width;
      } else {
        width = this.max.width;
      }
      
      var height;
      if(this.options.height != "auto") {
        height = this.options.height;
      } else {
        height = this.max.height;
      }

      this.share("width", width);
      this.share("height", height);

      if(this.options.elements == true) {
      
        for (var i=0; i < this.elements.length; i++) {
          this.elements[i].offsets = 
          this.calculateOffsets(width, height, this.elements[i].dimensions.width, this.elements[i].dimensions.height);
          this.elements[i].offsets.width = width-this.elements[i].offsets.paddingLeft;
          this.elements[i].offsets.height = height-this.elements[i].offsets.paddingTop;
        }
      }
    },
    
    calculateOffsets: function(outerWidth, outerHeight, innerWidth, innerHeight) {
      var dimensions = {};
      
      var offsetWidth = (innerWidth - outerWidth) / 2;
      var offsetHeight = (innerHeight - outerHeight) / 2;
      
      if(offsetWidth > 0 ) {
        dimensions.paddingLeft = 0;
        dimensions.marginLeft = -offsetWidth;
      } else dimensions.paddingLeft = -offsetWidth;
      
      if(offsetHeight > 0 ) {
        dimensions.paddingTop = 0;
        dimensions.marginTop = -offsetHeight;
      } else dimensions.paddingTop = -offsetHeight;
      
      return dimensions;
    }
  };

})();