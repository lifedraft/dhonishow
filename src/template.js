(function(){

  var template = DhoniShow.register("template", function() {
    this.addEventListener("loaded", this, this.loaded, true);

    // Initialize the templateReady as throttled event
    this.addEventListener("templateReady", this, function(){}, true);
    
    this.element = this.parent.share.element;
    this.dimensions = this.parent.share.dimensions;

    var Class = new this.Class(this);

    for(var module in this.modules) {
      jQuery.extend(this.modules[module].prototype, Class, { options: this.options, _moduleName: module });
      new this.modules[module]();
    }

    this.dispatchEvent("templateReady");
  }, {
    manipulate: true
  });

  template.prototype = {
    loaded: function(){
      
    }
  };

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
      return this.parent.element.find("."+this._modulePlaceholders[name]);
    }
  };
  
  var base = DhoniShow.register("template.prototype.modules.base", function(){
    this.addEventListener("templateBaseReady", this, function(){}, true);
    
    var tagName = this.parent.element[0].tagName;
    var classNames = this.parent.element[0].className;
    if(tagName == "OL"){
      var newParent = jQuery("<div class='"+classNames+"'></div>");
      this.parent.element.wrap(newParent);
      this.parent.element[0].className = "";
      this.parent.element = newParent;
    } else {
      this.parent.element.children().wrap("<li></li>").parent().wrapAll('<ol class="dhonishow_module_base-elements"></ol>');
    }
    
    this.dispatchEvent("templateBaseReady");
  });


  var navigation = DhoniShow.register("template.prototype.modules.navigation", function(){
    this.addEventListener("templateBaseReady", this, this.templateBaseReady, true);
    
  });

  navigation.prototype = {
    templateBaseReady: function(){
      this.placeholders();
      this.parent.element.append(this.template);
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
        '<a class="dhonishow-previous-button previous" title="Previous">Back</a>',
      '</div>',
    '</div>'].join(""),
    
    current: function(placeholder){
      placeholder.text("current");
      //placeholder.text(this.parent.parent.shared.currentIndex+1);
    },
    
    allpages: function(placeholder){
      placeholder.text("allpages");
      //placeholder.text(this.parent.parent.shared.elements.length);
    },
    
    alt: function(placeholder) {
      placeholder.text("alt");
      //placeholder.text("alt");
    }
  };
})();