(function(){

  var template = DhoniShow.register("template", function() {
    this.addEventListener("beforeTemplate", this, function(){}, true);

    this.addEventListener("afterTemplate", this, function(){}, true);

    var Class = new this.Class(this);

    for(var module in this.modules) {
      jQuery.extend(this.modules[module].prototype, Class, { options: this.options, _moduleName: module });
      new this.modules[module]();
    }

    this.dispatchEvent("afterTemplate");
  });

  template.prototype.Class = function(parent){
    this.parent = parent;
  };

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
  
  var base = DhoniShow.register("template.prototype.modules.base", function(){
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
      elements.wrapAll('<ol class="dhonishow_module_base-elements"></ol>');
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

  var navigation = DhoniShow.register("template.prototype.modules.navigation", function() {
    this.addEventListener("templateBaseReady", this, this.templateBaseReady, true);
  });

  navigation.prototype = {
    templateBaseReady: function(){
      this.placeholders();
      this.parent.share("element").append(this.template);
      this.invokeModules();

      this.addEventListener("update", this, this.current, this.giveModluePlaceholder("current"));
      this.addEventListener("update", this, this.allpages, this.giveModluePlaceholder("allpages"));
      this.addEventListener("update", this, this.alt, this.giveModluePlaceholder("alt"));
    },
        
    template: ['<p class="dhonishow-alt">@alt</p>', // TODO Remove this array
    '<div class="dhonishow-paging-buttons">',
      '<div class="dhonishow-theme-helper">',
        '<a class="dhonishow-next-button next" title="Next">Next</a>',
        '<p class="dhonishow-paging">@current/@allpages</p>',
        '<a class="dhonishow-previous-button previous" title="Previous">Previous</a>',
      '</div>',
    '</div>'].join(""),
    
    current: function(placeholder){
      placeholder.text(this.parent.share("current")+1);
    },
    
    allpages: function(placeholder){
      placeholder.text(this.parent.share("elements").length);
    },
    
    alt: function(placeholder) {
      placeholder.text("alt");
    }
  };
})();