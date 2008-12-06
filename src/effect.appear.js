(function(){
  
  var appear = DhoniShow.register("effect.prototype.effects.appear", function(){
    this.addEventListener("loaded", this, this.center, true);
    this.addEventListener("update", this, this.update);
  });

  appear.prototype = {
    update: function(current, next) {
      var elements = this.parent.share("elements");
      elements[current].element.animate({ opacity: "toggle" }, this.options.duration*1000);
      elements[next].element.animate({ opacity: "toggle" }, this.options.duration*1000);
    },
    
    center: function() {
      this.parent.share("element").css("width", this.parent.share("width")+"px");
      this.parent.share("dimensionsWrapper").css("height", this.parent.share("height"));
      var elements = this.parent.share("elements");
      var currenIndex = this.parent.share("current");
      
      for (var i=0; i < elements.length; i++) {
        elements[i].element.css({
          paddingLeft: elements[i].dimensions.paddingLeft,
          paddingTop: elements[i].dimensions.paddingTop,
          marginLeft: elements[i].dimensions.marginLeft,
          marginTop: elements[i].dimensions.marginTop
        });
        if(i != currenIndex) elements[i].element.hide();
      };
    }
  };
  
})();