(function(){
  
  var autoplay = DhoniShow.register("autoplay", function(){

    if(this.options == true || this.options.each > this.options.duration ) {
      this.addEventListener("loaded", this, this.create, true);
      this.addEventListener("update", this, this.create);
    }
    
  }, {
    each: 2,
    random: true
  }, ["effect", "trigger"]);
  
  autoplay.prototype = {
    create: function(){
      var _this = this;
      this.executer = setTimeout(function(){
        
        if(_this.options.endless && !_this.options.random) _this.share("trigger").next();
        if(_this.options.random) {
          var next = Math.round(Math.random() * (_this.share("dimensions").length-1));
          if(_this.share("current") == next) { _this.create(); return; }
          
          _this.share("trigger").next({}, next);
        }
        
      }, this.options.each*1000);
    }
  };
  
})();