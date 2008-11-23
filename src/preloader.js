/*

  <div class="dhonishow">
    <img src="#" />
    <img src="#" />
    <img src="#" />
  </div>
  
  <ol class="dhonishow">
    <li><img src="#" /></li>
    <li><img src="#" /></li>
    <li><img src="#" /></li>
  </ol>
  
  <ul class="dhonishow">
    <li><img src="#" /></li>
    <li><img src="#" /></li>
    <li><img src="#" /></li>
  </ul>

  <div class="dhonishow">
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
    <div class="dhonishow-element"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p></div>
  </div>
  
*/

(function(){
  var elements = DhoniShow.register("elements", function(){
    this.parent.share.elements = this.parent.share.element.find("> img, > li, >.dhonishow-element");
  });
})();