jQuery.fn.flickrdhonishow = function(){
  return this.each(function(index){
    var element = jQuery(this);
    var href = element.find("link[rel=flickrdhonishow]").attr("href");
    var functionName = "flickrdhonishow_"+index;
    var data = {};
    
    window[functionName] = function(json) {
      data = json;
      buildDom();
    };

    jQuery.getScript(href+"&jsoncallback="+functionName);

    var buildDom = function() {
      element.text("");
      
      var items = data.items;
      for (var i=0; i < items.length; i++) {
        var item = items[i];
        element.append('<a href="'+item.link+'" title="'+item.title+'"><img src="'+item.media.m+'" title="'+item.title+'"/></a>');
      };
      
      element.removeClass("flickrdhonishow").addClass("dhonishow").dhonishow();
    };
    
  });
};