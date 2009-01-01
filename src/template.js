(function(){

  var template = DhoniShow.register("template", function(parent) {
    this.parent = parent;
    
    this.share("template", this);
    this.addEventListener("afterTemplate", this, function(){}, true);

    var Class = new this.Class();

    for(var module in this.modules) {
      jQuery.extend(this.modules[module].prototype, Class, { options: this.options, _moduleName: module });
      new this.modules[module](this);
    }
    this.dispatchEvent("afterTemplate");
  }, {
    mixins: ["trigger", "effect"]
  });

  template.prototype.Class = function() {};

  template.prototype.Class.prototype = {
    addEventListener: function(){
      this.parent.parent.event.addEventListener.apply(this.parent.parent.event, arguments);
    },
    dispatchEvent: function(){
      this.parent.parent.event.dispatchEvent.apply(this.parent.parent.event, arguments);
    },

    placeholders: function() {
      var modulePlaceholders = {};
      var moduleName = this._moduleName;
      this.template = this.template.replace(/@(\w*)/g, function(searchResultWithExpression, searchResult){ 
        modulePlaceholders[searchResult] = "dhonishow_module_"+moduleName+"-"+searchResult;
        return '<span class="'+modulePlaceholders[searchResult]+'"></span>';
      });
      return this._modulePlaceholders = modulePlaceholders;
    },
    invokeModules: function(){
      for(var module in this._modulePlaceholders)
        this[module](this.giveModluePlaceholder(module));
    },
    
    giveModluePlaceholder: function(name){
      return this.parent.share("element").find("."+this._modulePlaceholders[name]);
    }
  };
  
  var base = DhoniShow.register("template.prototype.modules.base", function(parent) {
    this.parent = parent;
    
    this.addEventListener("templateBaseReady", this, function(){}, true);
    var element = this.parent.share("element");
    var tagName = element[0].tagName;
    var classNames = element[0].className;
    var elements = [];
    if(tagName == "OL") {

      var newParent = jQuery("<div class='"+classNames+"'></div>");
      element.wrap(newParent);
      elements = element.children().addClass("dhonishow_module_base-element");
      element[0].className = "dhonishow_module_base-elements";
      this.parent.share("element", element.parent());

    } else {

      elements = this.parent.share("element").children().wrap("<li class='dhonishow_module_base-element'></li>").parent();
      elements.wrapAll('<div class="dhonishow_module_base"><ol class="dhonishow_module_base-elements"></ol></div>');
    }

    this.parent.share("dimensionsWrapper", this.parent.share("element").find(".dhonishow_module_base-elements"));
    this.setElements(elements);
    this.dispatchEvent("templateBaseReady");
  });

  base.prototype = {
    setElements: function(elements){
      var domElements = [];
      for (var i=0; i < elements.length; i++) {
        domElements.push({ element: jQuery(elements[i]) });
      };
      this.parent.share("elements", domElements);
    }
  };

  var navigation = DhoniShow.register("template.prototype.modules.navigation", function(parent) {
    this.parent = parent;
    this.addEventListener("templateBaseReady", this, this.templateBaseReady, true);
  });

  navigation.prototype = {
    templateBaseReady: function(){
      this.placeholders();
      this.parent.share("element").find(".dhonishow_module_base").append(this.template);

      this.addEventListener("update", this, this.current, this.giveModluePlaceholder("current"));
      this.addEventListener("update", this, this.allpages, this.giveModluePlaceholder("allpages"));
      this.addEventListener("update", this, this.alt, this.giveModluePlaceholder("alt"));
      this.addEventListener("update", this, this.next, this.parent.share("element").find(".next"));
      this.addEventListener("update", this, this.previous, this.parent.share("element").find(".previous"));
      this.dispatchEvent("update");
    },
        
    template: ['<p class="dhonishow-alt">@alt</p>', // TODO Remove this array
    '<div class="dhonishow-paging-buttons">',
      '<div class="dhonishow-theme-helper">',
        '<a class="dhonishow-next-button next" title="Next"><span>Next</span></a>',
        '<p class="dhonishow-paging">@current/@allpages</p>',
        '<a class="dhonishow-previous-button previous" title="Previous"><span>Previous</span></a>',
      '</div>',
    '</div>'].join(""),
    
    current: function(placeholder) {
      placeholder.text(this.parent.share("current")+1);
    },
    
    allpages: function(placeholder){
      placeholder.text(this.parent.share("elements").length);
    },
    
    alt: function(placeholder) {
      var titledAltedElements = this.parent.share("elements")[this.parent.share("current")].element.find("*[alt], *[title]");

      var alt = titledAltedElements.attr("alt");
      if(alt && alt.length != 0) {
        placeholder.text(titledAltedElements.attr("alt"));
      }
      
      var title = titledAltedElements.attr("title");
      if(title && title.length != 0) {
        placeholder.text(titledAltedElements.attr("title"));
      }
    },
    
    previous: function(placeholder, current, next){
      if(!this.options.endless && (next == 0 || next == undefined)) {
        placeholder.css("visibility", "hidden");
      } else {
        placeholder.css("visibility", "");
      }
    },
    
    next: function(placeholder, current, next){
      if(!this.options.endless && this.parent.share("elements").length-1 == next) {
        placeholder.css("visibility", "hidden");
      } else {
        placeholder.css("visibility", "");
      }
    }
  };
})();