var Dhonishow = function(element, options, index){
	if(!element.id) element.id = "dhonishow_"+index;
	this.dom = new DhonishowDomTemplate(element, this);

	for(var option in (this.options = new DhonishowOptions(element))){ // invokes constructor class of each option
		this[option] = new window["Dhonishow_"+option](this.options[option], this);
	}
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


var DhonishowDomTemplate = function(element, parent){
	this.parent = parent;
	this.element = element;
	this.saveChildren();
	this.placeholders();
	this.invokeModules();
	this.current = 0;
};

Dhonishow.extend(DhonishowDomTemplate, Dhonishow);

DhonishowDomTemplate.prototype.template = 

['<ol class="dhonishow-images">@images</ol>',
'<div class="dhonishow-navi">',
	'<p class="dhonishow-picture-alt">@alt</p>',
	'<div class="dhonishow-paging-buttons">',
		'<a class="dhonishow-next-picture" title="Next">Next</a>',
		'<p class="dhonishow-paging">@current of @allpages</p>',
		'<a class="dhonishow-previous-picture" title="Previous">Back</a>',
	"</div>",
'</div>'].join("");

DhonishowDomTemplate.prototype.elementWrapper = "<li class='element'></li>";

DhonishowDomTemplate.prototype.saveChildren = function(){
	this.children = jQuery(this.element).children();
	this.element.innerHTML = "";
};

DhonishowDomTemplate.prototype.placeholders = function(element){
	var modulePlaceholders = {};	
	$(this.element).append(this.template.replace(/@(\w*)/g, function(searchResultWithExpression, searchResult){
		modulePlaceholders[searchResult] = ".dhonishow_module_"+searchResult;
		return '<span class="dhonishow_module_'+searchResult+'"></span>';
	}));
	return this.modulePlaceholders = modulePlaceholders;
};

DhonishowDomTemplate.prototype.invokeModules = function(){
	for(var module in this.modulePlaceholders)
		this[module](jQuery(this.element).find(this.modulePlaceholders[module]));
};

DhonishowDomTemplate.prototype.images = function(placeholder){
	this.dhonishowElements = this.children || [];
	placeholder.replaceWith(this.dhonishowElements);
	jQuery(this.dhonishowElements).wrap(this.elementWrapper);
};

DhonishowDomTemplate.prototype.alt = function(placeholder){};
DhonishowDomTemplate.prototype.current = function(placeholder){};
DhonishowDomTemplate.prototype.allpages = function(placeholder){};


var DhonishowOptions = function(element){
	var suboption;
	this.effect = 'appear';
	this.duration = 0.6;
	this.hide = {
		paging: false,
		alt: false,
		navigation: false,
		buttons: false
	};
	this.center = {
		width: 300,
		height: 400		
	};
	this.preloader = true;
	
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
			this[suboption[1].toLowerCase()] = this[suboption[1].toLowerCase()] || {};
			this[suboption[1].toLowerCase()][suboption[2].toLowerCase()] = value;
		} else {
			this[option[1].toLowerCase()] = value;
		}
	};
	if( this.resize && this.center ) this.center = false;
	
};


// ###########################################################################

var Dhonishow_effect = function(effectName, parent){
	//this[effectName].initialize(options);
};

Dhonishow.extend(Dhonishow_effect, Dhonishow);
Dhonishow_effect.prototype = {
	next: function(next, current){},
	previous: function(next, current){}
};

jQuery.extend(Dhonishow_effect.prototype, {
	appear: {
		initialize: function(options){
			//console.log("Dhonishow_effect:appear");
		}
	}
});

// ###########################################################################

jQuery.extend(Dhonishow.helper = {}, {
	image: function ( element ) {
		var img;
		element = (typeof element == "object" && element.nodeType == "undefined" || element.length) ? element[0] : element;
		if(element.nodeName.toLowerCase() != "img") {
			if(img = jQuery(element).find("img") ) img.size() > 0 ? element = img[0] : true;
		}
		return element;
	},
	dimensions_give: function ( element ) {
		return {
			width: jQuery(element).width(),
			height: jQuery(element).height()
		};
	},
	delayed_image_load: function ( image, func, scope ) {
		var preloaderImage = jQuery("<img>").load(function (){
			func.call(scope, image);
			jQuery(this).unbind("onload");
		});

		this.clone_attributes(image, preloaderImage);
		$(image).replaceWith(preloaderImage);
	},
	delayed_dimensions_load: function(dimensions, func, scope){
		var image;
		if(!!!dimensions.width && !!!dimensions.height){
			if((image = $(scope).find("img")).length > 0){
				Dhonishow.helper.delayed_image_load(image, func, scope);
			};
			return;
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

var Dhonishow_duration = function(value, parent){
	//console.log(this, "Dhonishow_duration Class");
};
Dhonishow.extend(Dhonishow_duration, Dhonishow);

// ###########################################################################

var Dhonishow_hide = function(value, parent){
	this.parent = parent;	
	for(var hide in value) this[hide](value[hide]);
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
		jQuery(".dhonishow-previous-picture", this.parent.dom.element).hide();
		jQuery(".dhonishow-next-picture", this.parent.dom.element).hide();
	}
};
Dhonishow_hide.prototype.pagingbuttons = function(hide){
	if(hide) jQuery(".dhonishow-paging-buttons", this.parent.dom.element).hide();
};

// ###########################################################################

var Dhonishow_resize = function(value, parent){
	//console.log(this, "Dhonishow_resize Class");
};
Dhonishow.extend(Dhonishow_resize, Dhonishow);

Dhonishow_resize.prototype.update = function ( element ) {
	var dimensions = Dhonishow.helper.dimensions_give(element);
	
	$(this.parent.parent.dom.element).find(".dhonishow-image > li, .dhonishow-image").css({
		width: dimensions.width,
		height: dimensions.height
	});
	$(this.parent.parent.dom.element).css("width", element.width);
};


// ###########################################################################

var Dhonishow_center = function(value, parent){
	this.parent = parent;
	this.max = { width:0, height:0 };

	if (value){
		this.elements_wraper = jQuery(this.parent.dom.element).find(".dhonishow-images").css("height", value.height+"px");
		jQuery(this.parent.dom.element).css("width", value.width+"px");
		this.center();
	} else {
		this.updateMax();
	}
	
};
Dhonishow.extend(Dhonishow_center, Dhonishow);

Dhonishow_center.prototype.updateMax = function () {
	var parent = this;

	jQuery(parent.parent.dom.element).find(".element").each(function () {
		var dimensions = Dhonishow.helper.dimensions_give(this);
		
		Dhonishow.helper.delayed_dimensions_load(dimensions, arguments.callee, this);
		
		jQuery(parent.elements_wraper).css({
			height: parent.max.height = (parent.max.height < dimensions.height) ? dimensions.height : parent.max.height
		});
		jQuery(parent.parent.dom.element).css({ width: parent.max.width = (parent.max.width < dimensions.width) ? dimensions.width : parent.max.width });
	});
};

Dhonishow_center.prototype.center = function () {
	var parent = this;
	
	var parent_dimensions = Dhonishow.helper.dimensions_give(this.elements_wraper);
	jQuery(this.parent.dom.element).find(".element").each(function () {
		var dimensions = Dhonishow.helper.dimensions_give(jQuery(this).children());

		Dhonishow.helper.delayed_dimensions_load(dimensions, arguments.callee, this);

		jQuery(this).css({
			paddingLeft: ( (parent_dimensions.width/2)-(dimensions.width/2) ),
			paddingTop: ( (parent_dimensions.height/2)-(dimensions.height/2) )
		});
	});
};

// ###########################################################################

var Dhonishow_preloader = function(value, parent){
	//console.log(this, "Dhonishow_preloader Class");
};
Dhonishow.extend(Dhonishow_preloader, Dhonishow);


jQuery.fn.dhonishow = function(options){
	return jQuery.each(this, function(index){
		new Dhonishow(this, options, index);
	});
};

jQuery(function(){jQuery(".dhonishow").dhonishow();});