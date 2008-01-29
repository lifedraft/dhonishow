// -----------------------------------------------------------------------------------
//
//	Dhonishow » jQuery v1a
//	by Stanislav Müller
//	07/24/07
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//
// -----------------------------------------------------------------------------------

//document.write("<style type=\"text/css\" media=\"screen\">.dhonishow {width: 0;}</style>");  // to avoid imageload flash

(function ( $ ) {
		
	$.fn.dhonishow = function ( globalOptions ) {
		return this.each( function ( index ) {

			var parentElement = this,
			options = {
				effect : 'appear',
				duration : 0.6,
				hide: {
					paging: false,
					alt: false,
					navigation: false,
					buttons: false
				},
				dimensions: {
					width: 293,
					height: 384
				},
				pagingTemplate: ":current: of :allpages:",
				permalink: true,
				resize: false,
				center: true,
				preloader: true
			},
			dhonishowCurrentElement = 0,
			dhonishowElements = [],
			elements = {},
			effectStarted,
			periodicalExecuter,
			changingImages = false,
			maxDimensions = { width: 0, height: 0 };

			this.setDependences = function () {
				options.set( parentElement.className );
				if( Dom.areElementsGiven() ) {
					Dom.initialize();
					Autoplay.initialize();
					parentElement.style.display = '';
				}
			};
			
			var Dimensions = {
				updateMax: function () {
					$(parentElement).find(".dhonishow-image img").each(function () {
						var width = this.width;
						var height = this.height;

						$(parentElement).children(".dhonishow-image").css({
							width: maxDimensions.width = (maxDimensions.width < width) ? width : maxDimensions.width,
							height: maxDimensions.height = (maxDimensions.height < height) ? height : maxDimensions.height
						});
						$(parentElement).css("width", maxDimensions.width);
					});
				},
				update: function ( element ) {
					$(parentElement).find(".dhonishow-image > li, .dhonishow-image").css({
						width: element.width,
						height: element.height
					});
					$(parentElement).css("width", element.width);
				},
				handle: function ( element ) {
					if(options.resize) {
						this.update(Dom.image(element) );
					}else if(options.center) {
						this.updateMax();
						this.center();
					}
				},
				center: function () {
					var parent = $(parentElement).find(".dhonishow-image");
					parentHeight = parent.height();
					parentWidth = parent.width();

					$(parentElement).find(".dhonishow-image > li").each(function () {
						var element = Dimensions.give(this);
						if(element.width && element.height) {
							$(this).css({
								paddingLeft: ( (parentWidth/2)-(element.width/2) )+"px",
								paddingTop: ( (parentHeight/2)-(element.height/2) )+"px"
							});
						}
					});
				},
				give: function ( el ) {					
					var nextImage = Dom.image(el);
					return {
						width: (nextImage.width > 0) ? nextImage.width : $(el).width(),
						height: (nextImage.height > 0) ? nextImage.height : $(el).height()
					};
				}
			};

			var Preloader = {
				collection: [],
				initialize: function ( quantity ) {
					this.build(quantity);
					this.loadingInterval = this.setLoading();
					this.loadedCollection();
				},
				build: function ( quantity ) {
					var preloader = $(['<ul class="dhonishow-preloader">',
															'<li class="dhonishow-preloader-loading">Loading <span>...</span></li>',
															(function () {
																var str = "";
																for(var i = 1; i<=quantity; i++) {
																	str+=("<li>"+i+"</li>");
																}
																return str;
															})(),
														'</ul>'].join("") );
					return $(parentElement).find(".dhonishow-image").before(preloader);
				},
				setLoading: function () {
					var span = $(parentElement).find(".dhonishow-preloader-loading span")[0];
					return setInterval(function () {
						var length = span.innerHTML.length;
						(length == 3) ? span.innerHTML = "" : span.innerHTML += ".";
					}, 500);
				},
				unsetLoading: function () {
					return clearInterval(this.loadingInterval);
				},
				loadedCollection: function () {
					$.each(this.collection, function () {
						$(parentElement).find(".dhonishow-preloader li:nth-child("+(this+2)+")").addClass("loaded");
					});
					this.loadedAll();
				},
				loadedOne: function ( index ) {
					$(parentElement).find(".dhonishow-preloader li:nth-child("+(index+2)+")").addClass("loaded");
					this.loadedAll();
				},
				loadedAll: function () {
					if($(parentElement).find(".dhonishow-preloader .loaded").size() == dhonishowElements.length) {
						this.unsetLoading();
						$(parentElement).find(".dhonishow-preloader").fadeOut(600);
					}
				}
			};
			
			
			var Dom = {
				initialize: function(){
					$(parentElement).append( this.wrapImages() );
					this.appendNavigation();
					if(options.preloader) Preloader.initialize(dhonishowElements.length);
					
					this.elements.update();
					this.elements.observe();
					
				},
				wrapImages: function(){
					var ol = $("<ol class='dhonishow-image'></ol>");
					$(parentElement).children().each(function ( index ) {
						var el = this;
						var li = $("<li style='height:0px;overflow:hidden;list-style:none;padding:0;margin:0;'></li>");
						$(li).append($(el) );
						$(ol).append(li);
						
						switch( (function ( element ) {
									var element = Dom.image(element);
									if(element != undefined && element.nodeName.toLowerCase() == "img") return "image";
									return "text";
								})(el) ) {
						
							case "text":
								$(li).css("height", "auto");
								$(parentElement).css("width", options.dimensions.width);
								ol.css({
									width: options.dimensions.width,
									height: options.dimensions.height
								});
								if(index != dhonishowCurrentElement) li.css("display", "none");
								Preloader.collection.push(index);
								
								break;
							
							default:
								var image = Dom.image(el);
								var preloaderImage = $("<img>").load(function () {
									
									if(options.resize) {
										if(index == dhonishowCurrentElement) Dimensions.update(this);
									}else if(options.center) {
										Dimensions.handle(this);
									}else {
										Dimensions.updateMax();
									}

									if(options.preloader) Preloader.loadedOne(index);
									if(index != dhonishowCurrentElement) li.css("display", "none");
									li.css({height:"auto", overflow:"visible"});
									try{delete(li.get()[0].style.height);}catch(e) {}
									$(this).unbind("onload");

								});

								$(image).cloneImageProperties(preloaderImage);
								$(image).replaceWith(preloaderImage);

								break;
						}
						dhonishowElements.push(li);
					});
					return ol;
				},
				appendNavigation: function () {
					var navi = $(
					['<div class="dhonishow-navi">',
						'<p class="dhonishow-picture-alt"></p>',
						'<div class="dhonishow-paging-buttons">',
							'<a class="dhonishow-next-picture" title="Next">Next</a>',
							'<p class="paging"></p>',
							'<a class="dhonishow-previous-picture" title="Previous">Back</a>',
						"</div>",
					'</div>'].join("") );
					this.elements.navigation = navi;
					this.elements.alt = navi.find(".dhonishow-picture-alt");
					this.elements.next_button = navi.find(".dhonishow-next-picture");
					this.elements.previous_button = navi.find(".dhonishow-previous-picture");
					this.elements.paging = navi.find(".paging");
					return $(parentElement).append(navi);
				},
				image: function ( element ) {
					/*
						TODO 
						Create a bug report.
						Opera gives dimensions zero if an element is display:none;
					*/
					
					var img;
					element = (typeof element == "object" && element.nodeType == "undefined" || element.length) ? element[0] : element;
					if(element.nodeName.toLowerCase() != "img") {
						if(img = $(element).find("img") ) img.size() > 0 ? element = img[0] : true;
					}
					return element;
				},
				areElementsGiven: function(){
					if ( $( parentElement ).children().length > 0 ) {
						return true;
					} else {
						$(parentElement).append("<p>Plese read instructions about using DhoniShow on <br />"+
						"<a href='http://dhonishow.de' style='color:#fff' title='to DhoniShow site'>DhoniShow's website</a></p>").find("p").addClass("error");
						return false;
					}
				}
			};
			
			Dom.elements = {
				animations: {},
				
				update: function () {
					if(options.hide.navigation) {this.navigation.hide(); return;}
					this.updatePaging();
					this.updateAlt(dhonishowElements[dhonishowCurrentElement]);
					this.updateButtons();
				},
				
				updateButtons: function () {
					this.previous_button.hide();
					this.next_button.hide();
					
					if( options.hide.buttons ) 	return;
					if( dhonishowCurrentElement != 0 ) this.previous_button.show();
					if( dhonishowCurrentElement != (dhonishowElements.length - 1) ) this.next_button.show();
				},
				
				updatePaging: function () {
					
					var Template = {
						evaluate: function ( template, values ) {
							for(value in values) {
								template = template.replace(new RegExp(":"+value+":"), values[value]);
							}
							return template;
						}
					};
					
					if(options.hide.paging){ this.paging.hide(); return;}
					this.paging.text(Template.evaluate(options.pagingTemplate, {
						current: dhonishowCurrentElement+1,
						allpages: dhonishowElements.length
					}) );
				},
				
				updateAlt: function ( element ) {
					if(options.hide.alt){ this.alt.hide(); return; }
					var element = $( Dom.image(element) ), description = "";
					this.alt[0].innerHTML = "";
					if( element.attr('alt') ) {
						description = element.attr('alt');
					} else if ( element.attr('title') && element.attr("title").length > 0) {
						description = element.attr('title');
					} else if ( element.attr('src') && element.attr('src').length > 0 ) {
						var src = element.attr('src');
						description = src.split('/')[src.split('/').length-1];
					}
					this.alt[0].innerHTML = description;
				},
				
				observe: function () {
					/*
						TODO Improve the elegance of the observe function
					*/
					
					this.next_button.bind("click", function ( e ) {
						if(!changingImages) {
							Dom.elements.changeImage(dhonishowCurrentElement++, dhonishowCurrentElement);
							Autoplay.reset();
						}
					});

					this.previous_button.bind("click", function ( e ) {
						if(!changingImages) {
							Dom.elements.changeImage(dhonishowCurrentElement--, dhonishowCurrentElement);
							Autoplay.reset(); 							
						}
					});
				},
				
				changeImage: function ( next, current ) {
					this.update();
					changingImages = true;
					if(options.duration == "0") options.duration = 0.001; // jQuery's animate function takes only durations above zero
						
					if(options.resize) {
						var dimensions = Dimensions.give(el = dhonishowElements[current]);

						$(parentElement).find(".dhonishow-image").animate({
							width: dimensions.width,
							height: dimensions.height
						}, options.duration*1000);
						$(parentElement).animate({width: dimensions.width}, options.duration*1000);
					}

					dhonishowElements[current].animate(options.effect, options.duration*1000);
					dhonishowElements[next].animate(options.effect, options.duration*1000);

					setTimeout(function () { 
						changingImages = false;
						}, options.duration*1000);
				}
			};
			
			var Effect = {
				appear : {},
				vertical: {},
				horizontal: {}
			};
			
			var Autoplay = {
				initialize: function () {
					if(options.autoplay) this.periodicalExecuter = setInterval(this.periodical, options.autoplay*1000);
				},
				
				periodical: function(){
					if(!changingImages) {
						(dhonishowCurrentElement+1 == dhonishowCurrentElement.length) ? dhonishowCurrentElement-- : dhonishowCurrentElement++;

						if(dhonishowCurrentElement == dhonishowElements.length) {
							Dom.elements.changeImage(dhonishowElements.length-1, dhonishowCurrentElement = 0);
						}else{
							Dom.elements.changeImage(dhonishowCurrentElement-1, dhonishowCurrentElement);
						}
					}

				},				
				
				reset: function () {
					if(options.autoplay) {
						clearInterval(this.periodicalExecuter);
						this.periodicalExecuter = null;
						this.initialize();
					}
				}
			};

			$.extend(options, {
				set: function (classNames) {
					!parentElement.id ? parentElement.id = "dhonishow_"+(index+1) : "";

					var classNames = classNames.match(/(\w+|\w+-\w+)_(\w+)/g) || [];

					for (var i=0; i < classNames.length; i++) {
						var option = /(\w+|\w+-\w+)_(\w+)/.exec(classNames[i]), suboption;
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

					var effectName = this.effect;
					effectName != "appear" ? "" : this.effect = { opacity: "toggle" };
					effectName == "vertical" ? this.effect = { height: "toggle" } : "";
					effectName == "horizontal" ? this.effect = { width: "toggle" } : "";

					this.regexp = {
						imageNumber: new RegExp( "("+parentElement.id+")\/(\\W*\\d*|\\d*)" ),
						parentElementTest: new RegExp( parentElement.id )
					};

					if( this.resize && this.center ) $.extend( this, { center: false } );
					$.extend( this, globalOptions );
					return this;
				}
			});

			this.setDependences();
		});
	};

	$.fn.cloneImageProperties = function ( to ) {
		$.each(this, function () {
			if(this.title && this.title.length > 0) to.attr("title", this.title);
			if(this.alt && this.alt.length > 0) to.attr("alt", this.alt);
			if(this.src && this.src.length > 0) to.attr("src", this.src);
		});		
		return to;
	};
})( jQuery );

jQuery(document).ready(function () {
	$(".dhonishow").dhonishow();
});