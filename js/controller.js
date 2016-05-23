var MosaicController = function() {
  // Model to store array of image pieces for each deck
  this.imagePieces                   = new DeckModel();
  this.uploadImageElement            = document.querySelector('img');
  this.uploadImageElementColTilesQty = 0;
  this.uploadImageElementRowTilesQty = 0;
  this.fileElem                      = document.querySelector('input[type=file]');
};

/**
 * Extracted static methods for testing state with Jasmine
 */
MosaicController.testTileCountAfterSplitTilesIntoDecks = function(imagePiecesCount, colTilesQty, rowTilesQty) {
  return (imagePiecesCount === (colTilesQty * rowTilesQty)) || false;
};

/**
 * Dynamic methods of the Mosaic
 */
MosaicController.prototype = {

  displayImagesDecks: function() {
    var t = this;

    // Instantiate ImagePreloader to preload the images for all decks (rows)
    // in parallel (rather than in sequence) to make effective use of parallelism
    var ip = new ImagePreloader({
      parallel: true
    });
    var decks = t.imagePieces.getDecks();
    // console.log("decks are: " + decks.length);

    /**
     * Iterate over each of the decks of images pieces and instantiate each using the Deck class,
     * passing the preloader so it is shared across the decks for parallel processing and 
     * so the deck may add its image pieces to the queue
     */
    decks.forEach(function (deck, index) {
      // console.log("decks.forEach: " + index);
      new Deck(deck, ip, index);
    });

    // Preload commences when all decks image pieces are added to the queue
    ip.preload()
      // Promise associated with the ImagePreloader informs us when all decks are loaded
      .then(function () {
        // console.log('All decks loaded');

        // Toggle loading status and notifications state
        MosaicSingleton.Util.toggleLoading(false);
      });
  },

  /**
   * Process splitting the array of image tiles (of the uploaded image) into decks
   * @output - Callback function calls method to display the decks
   */
  splitTilesIntoDecks: function() {
    var t = this;

    // Retrieve image pieces stored in the Model using getter method and their quantity
    var imagePieces = t.imagePieces.getTiles();

    var imagePiecesLength = imagePieces.length;

    // console.log("img pieces length / col tiles / row tiles: " 
    //             + imagePiecesLength + ", " 
    //             + t.uploadImageElementColTilesQty + ", " 
    //             + t.uploadImageElementRowTilesQty);
    // console.log(_imagePieces);

    /**
     * Create Deck instances (which are collections of images for each for where the quantity 
     * of them should be the value: this.uploadImageElementRowTilesQty), and each containing 
     * an equal proportion of all the image slices for each row for processing in parallel
     */
    var decksOfImagePieces = [];
    // Iterate through image pieces and store bundles of them within elements
    // of an array for each row to be display.
    var startElem = 0;

    // Allow for case when only one tile exists
    var endElem = t.uploadImageElementColTilesQty > 1 ? t.uploadImageElementColTilesQty : 1;
    for (var i = 0; i < t.uploadImageElementRowTilesQty; i++) {
      decksOfImagePieces.push(imagePieces.slice(startElem, endElem));
      startElem = endElem;
      endElem = startElem + (t.uploadImageElementColTilesQty);
    }
    // console.log("decksOfImagePieces length: " + decksOfImagePieces.length);
    // console.log("decksOfImagePieces: " + decksOfImagePieces);

    // Store all decks in the ImagePieces (DeckModel) Model
    t.imagePieces.setDecks(decksOfImagePieces);

    var count = 0;
    for (var i = 0; i < decksOfImagePieces.length; i++) {
      count += decksOfImagePieces[i].length;
    }

    // Run Jasmine Test with count
    MosaicController.testTileCountAfterSplitTilesIntoDecks(count, 
              this.uploadImageElementColTilesQty, 
              this.uploadImageElementRowTilesQty)
    // console.log(count);
    // console.log(decksOfImagePieces);

    // Call method to display all the image decks
    t.displayImagesDecks();
  },

  /**
   * Process splitting the uploaded image into tiles that are stored in an image pieces Model
   * @output - Callback function calls method to split the tiles into decks
   */
  splitImageIntoTiles: function() {
    var t = this;

    // Call utility method to split given image into array of tiles and return output into callback function
    MosaicSingleton.Util.splitGivenImageIntoTiles(t.uploadImageElement, 
              t.uploadImageElementColTilesQty, 
              t.uploadImageElementRowTilesQty,
              function(imagePiecesArr) {
      
      // Store output image pieces array in a Model (MVC best practice)
      t.imagePieces = new DeckModel();
      t.imagePieces.setTiles(imagePiecesArr);
    
      // console.log("image pieces after splitting: " + t.imagePieces);
      t.splitTilesIntoDecks();
    });
  },

  /**
   * Process uploading and display image filename using JavaScript File API
   * @output - Callback function calls method to split the image
   * @param  {Object} uploadedFile - File object
   */
  processImagesUploaded: function(uploadedFile) {
    var t = this;

    // Instance of FileReader from File API
    var reader = new FileReader();

    // Toggle on the loading element so user is aware operation in progress
    reader.onloadstart = function() {
      MosaicSingleton.Util.toggleLoading(true);
    }

    /**
     * Method onloadend is triggered when read operation of readAsDataURL finishes
     * and readyState becomes 'done', prompting us to assign the 'result' attribute
     * (containing data url of file data as a base64 encoded string) to 
     * uploadImageElement DOM element.
     */
    reader.onloadend = function() {
      t.uploadImageElement.src = reader.result;

      // Call utility method to resize image to be divisible by the default tile size then run callback function
      MosaicSingleton.Util.resizeGivenImageToDivisibleByTileSize("", function() {
        // Obtain DOM element with updated dimensions
        var img = document.getElementById('image-uploaded');
        
        /**
         * Calculate qty of Tile Rows and Columns (with shrunk image size to avoid remainders dimensions).
         * If image width or height is less than default then set qty of cols and rows to 1.
         */
        t.uploadImageElementColTilesQty = img.width >= TILE_WIDTH ? Math.round(img.width / TILE_WIDTH) : 1;
        t.uploadImageElementRowTilesQty = img.height >= TILE_HEIGHT ? Math.round(img.height / TILE_HEIGHT) : 1;
        // console.log("Col tiles qty: " + t.uploadImageElementColTilesQty);
        // console.log("Row tiles qty: " + t.uploadImageElementRowTilesQty);

        // Call function to split the image
        t.splitImageIntoTiles();
      });
    }

    // Read contents of specified File passed to readAsDataURL method if it exists
    if (uploadedFile) {
      reader.readAsDataURL(uploadedFile);
      MosaicSingleton.Util.updateNotifications("");
    } else {
      MosaicSingleton.Util.updateNotifications("Error uploading file");
    }
  },

  /**
   * Register for events
   * @output - Call method to process the images being uploaded
   */
  registerForEvents: function() {
    // Store reference to MosaicController rather than the input element for access in
    // 'onchange' event handler scope
    var t = this;

    // Event listener detects click event on file upload button and removes all child nodes
    // from output so user can upload further images and view their mosaics
    t.fileElem.onclick = function() {
      var outputDiv = document.getElementById("container-output");
      while (outputDiv.firstChild) {
        outputDiv.removeChild(outputDiv.firstChild);
      }

      var imgDiv = document.getElementById('image-uploaded');
      imgDiv.removeAttribute("height");
      imgDiv.removeAttribute("width");
      imgDiv.removeAttribute("src");
      MosaicSingleton.Util.toggleLoading(false);
    }

    // Event listener detects when user changes selected option of file upload element
    t.fileElem.onchange = function() {
      // Pass the actual file 'file[0]' attached to the input DOM element (image file upload)
      t.processImagesUploaded(t.fileElem.files[0]);
    } // end event listener
  }

};
        