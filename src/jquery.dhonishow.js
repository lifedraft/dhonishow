jQuery.fn.dhonishow = function(options){
  return jQuery.each(this, function(index){
    new DhoniShow(this, options, index);
  });
};