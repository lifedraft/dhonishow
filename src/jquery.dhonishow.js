var Dhonishow = function(element, options, index){
	if(!element.id) element.id = "dhonishow_"+index;
	this.dom = new DhonishowDomTemplate(element);

	for(var option in (this.options = new DhonishowOptions(element))){ // invokes constructor class of each option
		new window["Dhonishow_"+option](this.options[option], this);
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


var DhonishowDomTemplate = function(element){
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
		'<p class="paging">@current of @allpages</p>',
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
	for(var module in this.modulePlaceholders){
		this[module](jQuery(this.element).find(this.modulePlaceholders[module]));
	}
};

DhonishowDomTemplate.prototype.images = function(placeholder){
	this.dhonishowElements = this.children || [];
	placeholder.replaceWith(this.dhonishowElements);
	jQuery(this.dhonishowElements).wrap(this.elementWrapper);
};

DhonishowDomTemplate.prototype.alt = function(placeholder){
	//console.log(this.template.get());
};

DhonishowDomTemplate.prototype.current = function(placeholder){};
DhonishowDomTemplate.prototype.allpages = function(placeholder){};


var DhonishowOptions = function(element){
	this.effect = 'appear';
	this.duration = 0.6;
	this.hide = {
		paging: false,
		alt: false,
		navigation: false,
		buttons: false
	};
	this.dimensions = {
		width: 293,
		height: 384
	};
	this.resize = false;
	this.center = true;
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
			if(suboption[1].toLowerCase() in this)
				this[suboption[1].toLowerCase()][suboption[2].toLowerCase()] = value;
		} else {
			this[option[1].toLowerCase()] = value;
		}
	};

	if( this.resize && this.center ) jQuery.extend( this, { center: false } );
	
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
			console.log("Dhonishow_effect:appear");
		}
	}
});

// ###########################################################################

jQuery.extend(Dhonishow.helper = {}, {
	image: function ( element ) {
		/*
			TODO 
			Create a bug report.
			Opera gives dimensions of zero if an element is display:none;
		*/

		var img;
		element = (typeof element == "object" && element.nodeType == "undefined" || element.length) ? element[0] : element;
		if(element.nodeName.toLowerCase() != "img") {
			if(img = jQuery(element).find("img") ) img.size() > 0 ? element = img[0] : true;
		}
		return element;
	}
});


var Dhonishow_dimensions = function(value, parent){
	//*
	
	this.parent = parent;
	this.parent.options.dimensions.max = this.parent.options.dimensions.max || { width:0, height:0 };
	
	var dhonishowElements = this.parent.dom.dhonishowElements.get();
	for (var i=0; i < dhonishowElements.length; i++) {
		switch( (function ( element ) {
			console.log(this.give(element));
					var element = Dhonishow.helper.image(element);
					if(element != undefined && element.nodeName == "IMG") return "image";
					return "text";
			}).call(this, dhonishowElements[i].parentNode) ) {

			case "text":
				$(li).css("height", "auto");
				$(parentElement).css("width", options.get("dimensions").width);
				ol.css({
					width: value.width,
					height: value.height
				});
				if(i != parent.parent.dom.current) li.css("display", "none");
				break;

			default:
				var parent = this;

				(function(index){
					var image = Dhonishow.helper.image(dhonishowElements[i]);
					var preloaderImage = jQuery("<img>").load(function () {

						parent.handle(this);

						if(index != parent.parent.dom.current){ 
							jQuery(this.parentNode).css("display", "none");
						}
						jQuery(this.parentNode).css({height:"auto", overflow:"visible"});
						try{delete(element.style.height);}catch(e) {}
						jQuery(this).unbind("onload");
					});

					$(image).cloneImageProperties(preloaderImage);
					$(image).replaceWith(preloaderImage);
				})(i);

				break;
		}
	};
	// */
	return this;
};
Dhonishow.extend(Dhonishow_dimensions, Dhonishow);

Dhonishow_dimensions.prototype.handle = function ( element ) {
	if(this.parent.options.resize) {
		// Moved to Dhonishow_resize
		// this.update(element);
	}else if(this.parent.options.center) {
		// Moved to Dhonishow_center;
		/*this.updateMax();
		this.center();*/
	}
};

Dhonishow_dimensions.prototype.give = function ( el ) {
	var nextImage = Dhonishow.helper.image(el);
	return {
		width: (nextImage.width > 0) ? nextImage.width : $(el).width(),
		height: (nextImage.height > 0) ? nextImage.height : $(el).height()
	}
};

// ###########################################################################

var Dhonishow_duration = function(value, parent){
	console.log(this, "Dhonishow_duration Class");
};
Dhonishow.extend(Dhonishow_duration, Dhonishow);

// ###########################################################################

var Dhonishow_hide = function(value, parent){
	console.log(this, "Dhonishow_hide Class");
};
Dhonishow.extend(Dhonishow_hide, Dhonishow);

// ###########################################################################

var Dhonishow_resize = function(value, parent){
	console.log(this, "Dhonishow_resize Class");
};
Dhonishow.extend(Dhonishow_resize, Dhonishow);

Dhonishow_resize.prototype.update = function ( element ) {
	var dimensions = this.give(element);
	
	$(this.parent.parent.dom.element).find(".dhonishow-image > li, .dhonishow-image").css({
		width: dimensions.width,
		height: dimensions.height
	});
	$(this.parent.parent.dom.element).css("width", element.width);
};


// ###########################################################################

var Dhonishow_center = function(value, parent){
	console.log(this, "Dhonishow_center Class");
};
Dhonishow.extend(Dhonishow_center, Dhonishow);

Dhonishow_center.prototype.updateMax = function () {
	var parent = this;
	var children = jQuery(parent.parent.dom.element).find(".element");
	var parentElement = children.parent();

	children.each(function () {
		var dimensions = parent.give(this);

		jQuery(parentElement).css({
			width: parent.parent.options.dimensions.max.width = (parent.parent.options.dimensions.max.width < dimensions.width) ? 
				dimensions.width : parent.parent.options.dimensions.max.width,

			height: parent.parent.options.dimensions.max.height = (parent.parent.options.dimensions.max.height < dimensions.height) ? 
				dimensions.height : parent.parent.options.dimensions.max.height
		});

		jQuery(parent.parent.dom.element).css({ width: parent.parent.options.dimensions.max.width });
	});
};

Dhonishow_center.prototype.center = function () {
	var parent = this;
	var parentElement = $(this.parent.dom.element).find(".dhonishow-image");
	parentHeight = parentElement.height();
	parentWidth = parentElement.width();

	jQuery(this.parent.dom.element).find(".dhonishow-image > li").each(function () {
		var dimensions = this.give(this);
		if(element.width && element.height) {
			jQuery(this).css({
				paddingLeft: ( (parentWidth/2)-(dimensions.width/2) ),
				paddingTop: ( (parentHeight/2)-(dimensions.height/2) )
			});
		}
	});
};

// ###########################################################################

var Dhonishow_preloader = function(value, parent){
	console.log(this, "Dhonishow_preloader Class");
};
Dhonishow.extend(Dhonishow_preloader, Dhonishow);


jQuery.fn.cloneImageProperties = function ( to ) {
	jQuery.each(this, function () {
		if(this.title && this.title.length > 0) to.attr("title", this.title);
		if(this.alt && this.alt.length > 0) to.attr("alt", this.alt);
		if(this.src && this.src.length > 0) to.attr("src", this.src);
	});
	return to;
};

jQuery.fn.dhonishow = function(options){
	return jQuery.each(this, function(index){
		new Dhonishow(this, options, index);
	});
};

jQuery(function(){jQuery(".dhonishow").dhonishow();});