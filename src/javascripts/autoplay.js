(function(){
  
  var autoplay = DhoniShow.register("autoplay", function(parent){
    this.parent = parent;
    
    this.share("autoplay", this);
    this.state = "stop";

    if(this.options.each) {
      this.addEventListener("loaded", this, this.play, true);
    }
  }, {
    each: 0,
    random: false
  });
  
  autoplay.prototype = {
    play: function() {
      var _this = this;
      this.stop();
      this.interval = setInterval(function(){

        if(!_this.options.random) {
          if(_this.share("current")+1 == _this.share("elements").length) {
            _this.share("trigger").next({}, 0);
          } else {
            _this.share("trigger").next();
          }
        } else {
          var next = Math.round(Math.random() * (_this.share("elements").length-1));
          if(_this.share("current") == next) { _this.play(); return; }
          
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