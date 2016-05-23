describe("MosaicController", function() {

  beforeEach(function() {
  });

  it("should return true when total count of tiles in matrix equals colTilesQty multiplied by rowTilesQty", function() {
    var imagePiecesCount = 16;
    var colTilesQty = 4;
    var rowTilesQty = 4;
    expect( MosaicController.testTileCountAfterSplitTilesIntoDecks(imagePiecesCount, colTilesQty, rowTilesQty)).toBe(true);
  });

});