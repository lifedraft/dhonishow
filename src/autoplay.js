(function(){
  
  var autoplay = DhoniShow.register("autoplay", function(){
    this.share("autoplay", this);
    this.state = "stop";
    
    if(this.options.each > this.options.duration ) {
      this.addEventListener("loaded", this, this.play, true);
    }
    
  }, {
    each: 2,
    random: true
  }, ["effect", "trigger"]);
  
  autoplay.prototype = {
    play: function(){
      var _this = this;
      this.interval = setInterval(function(){
        
        if(_this.options.endless && !_this.options.random) _this.share("trigger").next();
        if(_this.options.random) {
          var next = Math.round(Math.random() * (_this.share("dimensions").length-1));
          if(_this.share("current") == next) { _this.create(); return; }
          
          _this.share("trigger").next({}, next);
        }
      }, this.options.each*1000);
      return this.state = "play";
    },
    
    stop: function(){
      clearInterval(this.interval);
      return this.state = "stop";
    }
  };
  
})();