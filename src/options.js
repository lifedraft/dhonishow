DhoniShow.prototype.options = function(string) {

  var names = string.toLowerCase().split(" ");
  
  for(var i = 0; i < names.length; i++) {
    if(names[i].indexOf("_") != -1) {
      var destination = this, 
      option = names[i].split("_"),
      value = this.recognizeValue(option[1]),
      path = option[0],
      name = option[0];
      
      if(path.indexOf("-") != -1) {
        var path = path.split("-");

        for(var j = 0; j < path.length; j++ ) {
          name = path[j];
          
          if(!(name in destination)) {
            if(j == path.length-1){
              destination[name] = value;
            } else {
              destination = destination[name] = {};
            }
          } else {
            destination = destination[name];
          }
        }
      } else {
        this[name] = value;
      }
    }
  }
};

DhoniShow.prototype.options.prototype.recognizeValue = function(value) {
  if(value == "true") return true;
  if(value == "false") return false;
  if( (/dot/).test(value) ){
    return value = Number( value.replace(/dot/, ".") );
  }
  return value;
};