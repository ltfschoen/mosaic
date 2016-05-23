/**
 * Composite Design Pattern used to leverage recursion and loose coupling benefits 
 * where possible with Interfaces for each Deck composite object of the Container element,
 * implemented by means of using methods for organisation and structure.
 * Note: Check potential performance issues for large composites
 */
var DeckComposite = function () {
  // Container Elem
  this.containerElem = document.getElementById('container-output');
}

DeckComposite.prototype = {

  setup: function(id) {
    // console.log("setup: " + id);

    // Generate Deck Elem
    var deckElem = document.createElement('div');
    deckElem.id = 'deck' + id;
    deckElem.className = 'composite-row';
    // deckElem.innerHTML = this.children;

    // Initially do not display the preloaded image
    deckElem.setAttribute("style", "display: none;");

    // Append dynamically created deckElem to containerElem
    this.containerElem.appendChild(deckElem);
  },

  update: function(deck, id) {
    // console.log("update: " + id);

    // Find Deck Elem to Update with Deck
    var deckElem = document.getElementById("deck" + id);
    deckElem.appendChild(deck);

    // Append dynamically created deckElem to containerElem
    this.containerElem.appendChild(deckElem);
  },

  getChild: function(id) {
    var deckElem = document.getElementById("deck" + id);
    return deckElem;
  },

  show: function(id) {
    // console.log("showing: " + id);
    var deckElem = document.getElementById("deck" + id);
    if (deckElem !== null) {
      deckElem.setAttribute("style", "display: block; clear: both;");
    }
  },

  // Helper Methods
  getElement: function() {
    return this.containerElem;
  }
}