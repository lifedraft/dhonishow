/* The MIT License

Copyright (c) 2008 Stanislav Müller
http://lifedraft.de

*/

var Dhonishow = function(element, options, index) {
  var _this = this;
  
  if(!element.id) element.id = "dhonishow_"+index;
  if(this.elementsSet(element)){

    this.dom = new DhonishowDomTemplate(element, this);

    for(var option in (this.options = new DhonishowOptions(element))) // invokes constructor class of each option
      if (this[option] != false) this[option] = new window["Dhonishow_"+option](this.options[option], this);

    jQuery(window).bind('load', function(event) { if(!_this.options.hide.navigation) jQuery(".dhonishow-navi", element).show(); });
  }
};

Dhonishow.prototype.registerUpdater = function(scope, func_name){
  this.updaters = this.updaters || [];
  var args = []; for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
  this.updaters.push({scope: scope, func_name: func_name, args: args});
  return scope[func_name];
};

Dhonishow.prototype.callUpdaters = function(){
  for (var i=0; i < this.updaters.length; i++)
    this.updaters[i].scope[this.updaters[i].func_name].apply(this.updaters[i].scope, this.updaters[i].args);
};

Dhonishow.prototype.animating = function(){
  return jQuery(this.dom.element).find("*:animated").length;
};

Dhonishow.prototype.elementsSet = function(element){
  if ( jQuery( element ).children().length > 0 ) return true;

  jQuery( element ).append("<p>Plese read instructions about using DhoniShow on <br />"+
    "<a href='http://dhonishow.de' style='color:#fff' title='to DhoniShow site'>DhoniShow's website</a></p>").find("p").addClass("error");
  return false;
};

Dhonishow.extend = function(subClass, superClass){

  /*
    THX to Dustin Diaz and Ross Harmes for this great book:
    Pro JavaScript Design Patterns
    :)
  */

  var F = function(){};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;

  subClass.superclass = superClass.prototype;
  if (superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  };
};

// ###########################################################################

jQuery.extend(Dhonishow.helper = {}, {
  
  image: function ( element  ) {
    /*
      @element : HTML Node object
      return: HTML Node object
    */
    
    var img;
    element = (typeof element == "object" && element.nodeType == "undefined" || element.length) ? element[0] : element;
    if(element.nodeName.toLowerCase() != "img") {
      if((img = jQuery(element).find("img")) || (img = jQuery(element).filter("img"))){ 
        if(img.length > 0){
          element = img[0];
        }
      }
    }
    return element;
  },

  dimensions_give: function ( element ) {


    var element = jQuery(element);
    var image;
    var width = element.width();
    var height = element.height();

    if(width == 0 || height == 0){

      if(element[0] != (image = this.image(element))){
        width = image.width;
        height = image.height;
      }else {
        if(!height) height = element.children().height();
        if(!width) width = element.children().width();
      }
    };
    return { width: width, height: height };
  },

  delayed_image_load: function ( image, func, scope, args ) {
    var preloaderImage = jQuery("<img>").load(function (){
      this.onload = null;
      if(args) {
        var arg = jQuery.makeArray(args);
        arg.push({width: this.width, height: this.height});
      }

      func.apply(scope, arg || []);

      jQuery(this).unbind("onload");
    });
    
    this.clone_attributes(image, preloaderImage);
    jQuery(image).replaceWith(preloaderImage);

  },

  delayed_dimensions_load: function(dimensions, func, scope, args){
    var image;
    if(!!!dimensions.width || !!!dimensions.height){
      if( ( image = jQuery(this.image(scope)) ).length > 0 ) {
        this.delayed_image_load(image, func, scope, args);
      }
      if (jQuery.browser.msie) {
        var arg = jQuery.makeArray(args);
        
        arg.push({width: jQuery(window).width(), height: 500});
        func.apply(scope, arg);
      }
    }
  },

  clone_attributes: function (from, to ) {

    jQuery.each(from, function () {
      if(this.title && this.title.length > 0) to.attr("title", this.title);
      if(this.alt && this.alt.length > 0) to.attr("alt", this.alt);
      if(this.src && this.src.length > 0) to.attr("src", this.src);
    });
    return to;
  }
});

// ###########################################################################

var DhonishowOptions = function(element){
  
  var suboption;
  this.preloader = true;
  this.duration = 0.6;
  this.center = true;
  this.hide = {
   paging: false,
   alt: false,
   navigation: false,
   buttons: false
  };
  this.effect = 'appear';

  var names = element.className.match(/(\w+|\w+-\w+)_(\w+)/g) || [];
  for (var i=0; i < names.length; i++) {
    var option = /(\w+|\w+-\w+)_(\w+)/.exec(names[i]), suboption;
    var value = option[2];

    if( /true|false/.test(value) ){
      value = !!( value.replace(/false/, "") ); // Wild hack
    } else if( (/dot/).test(value) ){
      value = Number( value.replace(/dot/, ".") );
    }

    if (suboption = option[1].match(/(\w+)-(\w+)/) ) {
      if(typeof this[suboption[1].toLowerCase()] != "object") this[suboption[1].toLowerCase()] = {};
      this[suboption[1].toLowerCase()][suboption[2].toLowerCase()] = value;
    } else {
      this[option[1].toLowerCase()] = value;
    }
  };
  if( this.resize && this.center ) this.center = false;
  
};

// ###########################################################################

var DhonishowDomTemplate = function(element, parent){
  this.parent = parent;
  this.parent.current_index = 0;
  this.element = element;
  this.saveChildren();
  this.placeholders();
  this.invokeModules();
  
  this.parent.registerUpdater(this, "alt", this.giveModluePlaceholder("alt"));
  this.parent.registerUpdater(this, "current", this.giveModluePlaceholder("current"));
  this.parent.registerUpdater(this, "allpages", this.giveModluePlaceholder("allpages"));
  
};
Dhonishow.extend(DhonishowDomTemplate, Dhonishow);

DhonishowDomTemplate.prototype.template =
['<ol class="dhonishow-elements">@images</ol>',
'<div class="dhonishow-navi" style="display:none;">',
  '<p class="dhonishow-picture-alt">@alt</p>',
  '<div class="dhonishow-paging-buttons">',
    '<a class="dhonishow-next-button" title="Next">Next</a>',
    '<p class="dhonishow-paging">@current of @allpages</p>',
    '<a class="dhonishow-previous-button" title="Previous">Back</a>',
  "</div>",
'</div>'].join("");

DhonishowDomTemplate.prototype.elementWrapper = "<li class='element'></li>";

DhonishowDomTemplate.prototype.saveChildren = function(){
  this.children = jQuery(this.element).children();
  this.element.innerHTML = "";
};

DhonishowDomTemplate.prototype.placeholders = function(element){
  var modulePlaceholders = {};
  jQuery(this.element).append(this.template.replace(/@(\w*)/g, function(searchResultWithExpression, searchResult){
    modulePlaceholders[searchResult] = ".dhonishow_module_"+searchResult;
    return '<span class="dhonishow_module_'+searchResult+'"></span>';
  }));
  return this.modulePlaceholders = modulePlaceholders;
};

DhonishowDomTemplate.prototype.invokeModules = function(){
  for(var module in this.modulePlaceholders)
    this[module](this.giveModluePlaceholder(module));
};

DhonishowDomTemplate.prototype.giveModluePlaceholder = function(name){
  return jQuery(this.element).find(this.modulePlaceholders[name]);
};

DhonishowDomTemplate.prototype.images = function(placeholder){
  var _this = this;
  this.children || [];

  placeholder.replaceWith(this.children);	
  jQuery(this.children).wrap(this.elementWrapper);
  this.dhonishowElements = jQuery(this.children).parent();
};

DhonishowDomTemplate.prototype.alt = function(placeholder){
  var alt, title, src;
  if(alt = jQuery(this.dhonishowElements[this.parent.current_index]).find("*[alt]").attr("alt")){
    if(jQuery(alt).filter("*").length){ placeholder.each(function(){ this.innerHTML = alt; }); return; }
    placeholder.text(alt);
    return;
  }
  if(title = jQuery(this.dhonishowElements[this.parent.current_index]).find("*[title]").attr("title")){
    placeholder.text(title);
    return;
  }
  if(src = jQuery(this.dhonishowElements[this.parent.current_index]).find("*[src]").attr("src")){
    var src = src.split('/');
    placeholder.text(src[src.length-1]);
    return;
  }
};

DhonishowDomTemplate.prototype.current = function(placeholder){
  placeholder.text(this.parent.current_index+1);
};

DhonishowDomTemplate.prototype.allpages = function(placeholder){
  placeholder.text(this.dhonishowElements.length);
};

// ###########################################################################

var Dhonishow_effect = function(effectName, parent){
  this.parent = parent;
  this.effect = new window["Dhonishow_effect_"+effectName](this);
  this.addObservers();
};

Dhonishow.extend(Dhonishow_effect, Dhonishow);
Dhonishow_effect.prototype.addObservers = function(){
  var parentElement = jQuery(this.parent.dom.element);
  parentElement.find(".dhonishow-previous-button").bind("click", this, this.previous);
  parentElement.find(".dhonishow-next-button").bind("click", this, this.next);
};

Dhonishow_effect.prototype.next = function(event){
  var _this = event.data;
  if(!_this.parent.animating()){
    var current = _this.parent.current_index;
    var next = ++_this.parent.current_index;
    _this.parent.callUpdaters();

    _this.effect.update(
      jQuery(_this.parent.dom.dhonishowElements[next]), 
      jQuery(_this.parent.dom.dhonishowElements[current]),
      _this.parent.options.duration
    );
  }
};

Dhonishow_effect.prototype.previous = function(event){
  var _this = event.data;
  if(!_this.parent.animating()){
    var current = _this.parent.current_index;
    var next = --_this.parent.current_index;
    _this.parent.callUpdaters();

    _this.effect.update(
      jQuery(_this.parent.dom.dhonishowElements[next]), 
      jQuery(_this.parent.dom.dhonishowElements[current]),
      _this.parent.options.duration
    );
  }
};

// ###########################################################################

Dhonishow_effect_appear = function(parent){
  this.parent = parent;	
  this.parent.parent.hide.not_current();
};

Dhonishow.extend(Dhonishow_effect_appear, Dhonishow_effect);
Dhonishow_effect_appear.prototype.update = function(next_element, current_element, duration){
  current_element.animate({ opacity: "toggle" }, duration*1000);
  next_element.animate({ opacity: "toggle" }, duration*1000);
};

// ###########################################################################

Dhonishow_effect_resize = function(parent){
  this.parent = parent;

  var lenght = this.parent.parent.dom.dhonishowElements.length;
  jQuery(this.parent.parent.dom.dhonishowElements.get().reverse()).each(function(index){
    jQuery(this).css( "z-index", index + 1 );
  });

};
Dhonishow.extend(Dhonishow_effect_resize, Dhonishow_effect);

Dhonishow_effect_resize.prototype.update = function(next_element, current_element, duration){
  var dimensions = Dhonishow.helper.dimensions_give(next_element);

  jQuery(this.parent.parent.dom.element).find(".dhonishow-elements").animate( {height: dimensions.height }, duration * 1000 );

  jQuery(this.parent.parent.dom.element).animate( { width: dimensions.width }, duration * 1000 );

  current_element.fadeOut( duration * 1000 );
  next_element.fadeIn( duration * 1000 );
};

// ###########################################################################

var Dhonishow_duration = function(value, parent){
  if(value == 0){ parent.options.duration = 0.01;}
};
Dhonishow.extend(Dhonishow_duration, Dhonishow);

// ###########################################################################

var Dhonishow_hide = function(value, parent){
  this.parent = parent;
  for(var hide in value) this[hide](value[hide]);

  var previous_button = jQuery(this.parent.dom.element).find(".dhonishow-previous-button");
  var next_button = jQuery(this.parent.dom.element).find(".dhonishow-next-button");

  this.parent.registerUpdater(this, "previous_button", previous_button).call(this, previous_button);
  this.parent.registerUpdater(this, "next_button", next_button).call(this, next_button);
};
Dhonishow.extend(Dhonishow_hide, Dhonishow);

Dhonishow_hide.prototype.paging = function(hide){
  if(hide) jQuery(".dhonishow-paging", this.parent.dom.element).hide();
};

Dhonishow_hide.prototype.alt = function(hide){
  if(hide) jQuery(".dhonishow-picture-alt", this.parent.dom.element).hide();
};

Dhonishow_hide.prototype.navigation = function(hide){
  if(hide) jQuery(".dhonishow-navi", this.parent.dom.element).hide();
};

Dhonishow_hide.prototype.buttons = function(hide){
  if(hide) {
    jQuery(".dhonishow-previous-button", this.parent.dom.element).hide();
    jQuery(".dhonishow-next-button", this.parent.dom.element).hide();
  }
};

Dhonishow_hide.prototype.previous_button = function(button){
  button.hide();
  if( this.parent.current_index != 0 && !this.parent.options.hide.buttons ) button.show();
};

Dhonishow_hide.prototype.next_button = function(button){
  button.hide();
  if( this.parent.current_index != (this.parent.dom.dhonishowElements.length - 1) && !this.parent.options.hide.buttons) button.show();
};

Dhonishow_hide.prototype.not_current = function(){
  var element, current = this.parent.current_index;
  
  jQuery(this.parent.dom.dhonishowElements).each(function(index){
    if(index != current)
      jQuery(this).hide();
    else
      element = jQuery(this);
  });
  
  return element;
};

// ###########################################################################

var Dhonishow_center = function(value, parent){
  this.parent = parent;
  this.max = { width:0, height:0 };
  
  if (value && this.parent.options.effect != "resize"){
    this.center();
    if (value.width || value.height) jQuery(window).bind("load", this, this.dimensions_set);

  } else {
    this.update_max();
  }
};
Dhonishow.extend(Dhonishow_center, Dhonishow);

Dhonishow_center.prototype.center = function () {
  var _this = this;
  var elements_wraper = jQuery(this.parent.dom.element).find(".dhonishow-elements");

  jQuery(this.parent.dom.element).find(".element").each(function (index) {

    var dimensions = arguments[2] ? arguments[2] : Dhonishow.helper.dimensions_give(this);

    Dhonishow.helper.delayed_dimensions_load(dimensions, arguments.callee, this, arguments);
        
    if(!dimensions.width || !dimensions.height) return;

    _this.max.height = (dimensions.height > _this.max.height) ? dimensions.height : _this.max.height;
    _this.max.width = (dimensions.width > _this.max.width) ? dimensions.width : _this.max.width;

    jQuery(elements_wraper).css({ height: _this.max.height });
    jQuery(_this.parent.dom.element).css({ width: _this.max.width });
    
    jQuery(_this.parent.dom.element).find(".element").each(function(){
      var element_dimensions = Dhonishow.helper.dimensions_give(this);
      
      jQuery(this).css({
        paddingLeft: ( (_this.max.width - element_dimensions.width) / 2 )+"px",
        paddingTop: ( (_this.max.height - element_dimensions.height) / 2 )+"px"
      });
    });

    _this.parent.preloader.loadedOne(index);

    if(index != _this.parent.current_index) jQuery(this).hide();
  });

};

Dhonishow_center.prototype.update_max = function () {
  var _this = this;
  var elements_wraper = jQuery(this.parent.dom.element).find(".dhonishow-elements");

  jQuery(this.parent.dom.element).find(".element").each(function (index) {

    var dimensions = (arguments[2]) ? arguments[2] : Dhonishow.helper.dimensions_give(this);

    Dhonishow.helper.delayed_dimensions_load(dimensions, arguments.callee, this, arguments);

    if(!dimensions.width || !dimensions.height) return;

    _this.max.height = (dimensions.height > _this.max.height) ? dimensions.height : _this.max.height;
    _this.max.width = (dimensions.width > _this.max.width) ? dimensions.width : _this.max.width;

    jQuery(elements_wraper).css({ height: _this.max.height });
    jQuery(_this.parent.dom.element).css({ width: _this.max.width });

    _this.parent.preloader.loadedOne(index);
    
    if(index != _this.parent.current_index) jQuery(this).hide();
  });
  
  if(this.parent.options.effect == "resize") jQuery(window).bind("load", function(){
    var dimensions = Dhonishow.helper.dimensions_give(_this.parent.dom.dhonishowElements[_this.parent.current_index]);

    jQuery(_this.parent.dom.element).find(".dhonishow-elements").css({height: dimensions.height});
    jQuery(_this.parent.dom.element).css({width: dimensions.width});
  });
};

Dhonishow_center.prototype.dimensions_set = function(event){
  var _this = event.data;
  var value = _this.parent.options.center;

  if(value.width) jQuery(_this.parent.dom.element).css({ width:  value.width+"px" });
  if(value.height) jQuery(_this.parent.dom.element).find(".dhonishow-elements").css({ height:  value.height+"px" });
  
  var element_dimensions = {
    width: new Number(value.width || jQuery(_this.parent.dom.element).css("width").replace("px", "")),
    height: new Number(value.height || jQuery(_this.parent.dom.element).find(".dhonishow-elements").css("height").replace("px", ""))
  };

  jQuery(_this.parent.dom.element).find(".element").each(function(){
    var width = jQuery(this).width();
    var height = jQuery(this).height();

    var css = {};
    var offsetWidth = ( width - element_dimensions.width ) / 2;
    var offsetHeight = ( height - element_dimensions.height ) / 2;
    
    if(offsetWidth > 0) {
      css.paddingLeft = 0;
      css.marginLeft = offsetWidth - offsetWidth - offsetWidth + "px";
    } else css.paddingLeft = offsetWidth - offsetWidth - offsetWidth + "px";


    if(offsetHeight > 0){
      css.paddingTop = 0;
      css.marginTop = offsetHeight - offsetHeight - offsetHeight + "px";
    } else css.paddingTop = offsetHeight - offsetHeight - offsetHeight + "px";

    jQuery(this).css(css);
  });
};

// ###########################################################################

var Dhonishow_autoplay = function(value, parent){
	this.parent = parent;
	this.create(value);
};

Dhonishow.extend(Dhonishow_autoplay, Dhonishow);

Dhonishow_autoplay.prototype.create = function(duration) {
  var _this = this;
  this.executer = setInterval(function(){
    _this.parent.current_index++;

    if(_this.parent.current_index == _this.parent.dom.dhonishowElements.length) {
      _this.parent.effect.effect.update(
        jQuery(_this.parent.dom.dhonishowElements[_this.parent.current_index = 0]), 
        jQuery(_this.parent.dom.dhonishowElements[_this.parent.dom.dhonishowElements.length-1]),
        _this.parent.options.duration
      );
    }else{
      _this.parent.effect.effect.update(
        jQuery(_this.parent.dom.dhonishowElements[_this.parent.current_index]),
        jQuery(_this.parent.dom.dhonishowElements[_this.parent.current_index-1]),
        _this.parent.options.duration
      );
    }
    _this.parent.callUpdaters();
  }, duration*1000);
};


/*
  TODO Does it realy work? 
  Where does options.autoplay came from?
*/

Dhonishow_autoplay.prototype.reset = function () { 
  if(options.autoplay) {
    clearInterval(this.executer);
    this.executer = null;
    this.create(this.parent.options.autoplay);
  }
};

// ###########################################################################

var Dhonishow_preloader = function(value, parent){
  this.parent = parent;

  if(value){
    this.build(this.parent.dom.dhonishowElements.length);
    this.loadingInterval = this.setLoading();
  }
};
Dhonishow.extend(Dhonishow_preloader, Dhonishow);

Dhonishow_preloader.prototype.collection = [];

Dhonishow_preloader.prototype.build = function ( quantity ) {
  this.template = jQuery(['<ul class="dhonishow-preloader">',
    '<li class="dhonishow-preloader-loading">Loading <span>...</span></li>',
      (function () {
        var str = "";
        for(var i = 1; i<=quantity; i++) {
          str+=("<li>"+i+"</li>");
        }
        return str;
        })(),
        '</ul>'].join("") );
    return jQuery(this.parent.dom.element).find(".dhonishow-elements").before(this.template);
};

Dhonishow_preloader.prototype.setLoading = function () {
  var span = this.template.find("span")[0];
  return setInterval(function () {
    var length = span.innerHTML.length;
    (length == 3) ? span.innerHTML = "" : span.innerHTML += ".";
  }, 500);
};

Dhonishow_preloader.prototype.unsetLoading = function () {
  return clearInterval(this.loadingInterval);
};

Dhonishow_preloader.prototype.loadedOne = function ( position ) {
  if(this.parent.options.preloader){
    this.template.find("li").eq(position+1).addClass("loaded");
    this.loadedAll();
  }
};

Dhonishow_preloader.prototype.loadedAll = function () {
  if(jQuery(this.parent.dom.element).find(".loaded").size() == this.parent.dom.dhonishowElements.length) {
    this.unsetLoading();
    jQuery(this.parent.dom.element).find(".dhonishow-preloader").fadeOut(600);
  }
};

jQuery.fn.dhonishow = function(options){
  return jQuery.each(this, function(index){
    new Dhonishow(this, options, index);
  });
};

jQuery(function(){jQuery(".dhonishow").dhonishow();});