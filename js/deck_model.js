var DeckModel = function() {
  this.tiles; // [ deck1-3 ]
  this.decks; // [ deck1, deck2, deck3 ]
}

DeckModel.prototype = {

  getTiles: function() {
    return this.tiles;
  },
  setTiles: function(newTiles) {
    this.tiles = newTiles;
  },
  getDecks: function() {
    return this.decks;
  },
  setDecks: function(newDecks) {
    this.decks = newDecks;
  }
}