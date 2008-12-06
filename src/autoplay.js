(function(){
  
  var autoplay = DhoniShow.register("autoplay", function(){
    this.share("autoplay", this);
    this.state = "stop";

    if(this.options.each) {
      this.addEventListener("loaded", this, this.play, true);
    }
  }, {
    each: 0,
    random: false,
    mixins: ["effect", "trigger"]
  });
  
  autoplay.prototype = {
    play: function(){
      var _this = this;
      this.stop();
      this.interval = setInterval(function(){
        
        if(_this.options.endless && !_this.options.random) {
          _this.share("trigger").next();
        } else if(_this.options.random) {
          var next = Math.round(Math.random() * (_this.share("dimensions").length-1));
          if(_this.share("current") == next) { _this.play(); return; }
          
          _this.share("trigger").next({}, next);
        } else {
          // TODO handle this like options.endless.
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