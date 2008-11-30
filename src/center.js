(function(){
  
  var center = DhoniShow.register("center", function(){
    this.elements = this.share("dimensions");
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
      for (var i=0; i < this.elements.length; i++) {
        var element = this.share("dimensions")[i].element = this.elements[i].element.parent();
        var dimensions = this.share("dimensions")[i].dimensions;
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

      if(this.options.elements == true) {
      
        for (var i=0; i < this.elements.length; i++) {
          var dimensions = this.elements[i].dimensions;
          
          var offsetWidth = (dimensions.width - width) / 2;
          var offsetHeight = (dimensions.height - height) / 2;
          
          if(offsetWidth > 0 ) {
            dimensions.paddingLeft = 0;
            dimensions.marginLeft = -offsetWidth;
          } else dimensions.paddingLeft = -offsetWidth;
          
          if(offsetHeight > 0 ) {
            dimensions.paddingTop = 0;
            dimensions.marginTop = -offsetHeight;
          } else dimensions.paddingTop = -offsetHeight;
        };
      }
    }
  };

})();