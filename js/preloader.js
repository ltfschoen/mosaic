// Deferred Promise (may be resolved later) is polyfilled as not part of native Promise API
function defer() {
  var resolve, reject, promise = new Promise(function (a, b) {
    resolve = a;
    reject = b;
  });

  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
}

/**
 * Image preloader
 * @param {Object} options
 */
var ImagePreloader = function (options) {
  this.deckComposite = new DeckComposite(); // Create Instance of Composite Design Pattern specific for Decks
  this.options = options || {};
  this.options.parallel = options.parallel || false;
  this.items = []; // Queue to hold the preloaded decks and associated callback
  this.max = 0;
};

/**
 * Queue method adds to the queue an array (a deck) of images to the
 * queue (but does not preload images).
 * @param  {Array} array - Array of images to add the queue
 * @return {Promise}
 */
ImagePreloader.prototype.queue = function (array) {

  if (!Array.isArray(array)) {
    array = [array];
  }

  if (array.length > this.max) {
    this.max = array.length;
  }
  
  var deferred = defer();

  // Keys in the array of preloaded decks
  this.items.push({
    collection: array,
    deferred: deferred
  });

  return deferred.promise;
};

/**
 * Helper function to preloads the base64 image, returning a promise to dynamically 
 * load the images that resolves when image successfully loaded by the browser or upon error. 
 * The Promise Constructor function with initial state of 'pending' in relation 
 * to the asynchronous code that it is monitoring is passed an anonymous 
 * function with two parameters:
 * - resolve() method sets state of promise to 'fulfilled'
 * - reject() method sets state of promise to 'rejected'
 *
 * Note that promise is not rejected and gets resolved even if the image 
 * cannot be loaded.
 *
 * @param  {String} base64Image, {Integer} currentDeckId
 * @return {Promise}
 */

ImagePreloader.prototype.preloadImage = function (base64Image, currentDeckId) {

  var t = this;

  return new Promise(function (resolve, reject) {
    // console.log("preloadImage base64Image: " + base64Image + ", deck id: " + currentDeckId);

    /**
     * Preload image by creating new image and assigning it to the src of it to 
     * cause the browser to load the source asyncronously, and the associated Promise
     * will resolve when the image is loaded by the brwoser.
     */
    var img = new Image();
    img.onload = function() {

      MosaicSingleton.Util.computeAverageTileColourForImage(img, function(hexNum) {
        // console.log("current deck: " + currentDeckId);
        // console.log("hexNum: " + hexNum);
        MosaicSingleton.Ajax.fetchSvgTileForHex(hexNum, function(svgNode) {
          // console.log("svg node: " + svgNode);
          // console.log("current deck: " + currentDeckId + " with svgNode: " + svgNode);

          // Composite Design Pattern Update
          t.deckComposite.update(svgNode, currentDeckId);

          // Resolve promise
          resolve(base64Image);
        });
      });

    }
    img.onerror = function() {
      reject(base64Image); // reject
    }
    img.src = base64Image;

  });
};

/**
 * Preload function preloads the queue of all the decks and returns
 * a promise that resolves when all decks loaded. Decks may be 
 * loaded sequencially or in parallel according to options configured.
 * @return {Promise}
 */
ImagePreloader.prototype.preload = function () {

  var t = this;

  var deck, decks = [];
  // var outputDiv = document.getElementById('output');
  // console.log("this.max: " + this.max);

  // Create a Div element for each row to load SVG's into
  for (var i = 0; i < this.max; i++) {

    // Composite Design Pattern Setup
    this.deckComposite.setup(i);
  }

  // Process the image decks in parallel
  if (this.options.parallel) {
    // Loop from 0 to the length of the longest deck
    for (var deckElem = 0; deckElem < this.max; deckElem++) {
      // console.log("deckElem: " + deckElem);
      // Iterate over the decks
      this.items.forEach(function (item) {
        if (typeof item.collection[deckElem] !== 'undefined') {
          // Replace the image at the current index i with a Promise that resolves when
          // image is downloaded by browser
          item.collection[deckElem] = this.preloadImage(item.collection[deckElem], deckElem);
          // console.log("item.collection[i]: " + item.collection[i]);
        }
      }, this);
    }
  }

  // Iterate over each deck
  this.items.forEach(function (item, index) {
    /**
    * Promise is resolved for each preloaded deck when all the promises of loading its 
    * associated array of images pieces into the browser has resolved.
    */
    deck = Promise.all(item.collection)
      // Execute callback to the Deck
      .then(item.deferred.resolve.bind(item.deferred))
      .catch(console.log.bind(console));

    /**
     * Satisfy goals of displaying the composited photomosaic (representative of the 
     * original image) such that the tiles of each deck (row) are rendered as a complete set
     * all at the same time (not piecemeal), and each deck (row) should be rendered sequentially
     * from top to bottom.
     *
     * Demonstrate that this goal has been achieved by setting a timer for each deck, such that
     * the timer trigger incrementally later for each deck, and so that when each deck triggers 
     * it changes the attributes of the pre-generated Div element holding the image to be displayed
     * instead of hidden.
     */
    function showRowsSequentiallyWhenEachFullyLoaded() {
      // Ensure first digit of the timeout interval is not 0 since we multiply later
      // Tweak the value of timeout to display each deck (row) faster or slower in the browser.
      // The timeout for each successive row must increase in order for rows to appear sequentially.
      var timePrefix = index + 1;
      var timeout = timePrefix * 100;
      setTimeout(function() { 
        // Composite Design Pattern Show
        t.deckComposite.show(index);
      }, timeout);
    }

    showRowsSequentiallyWhenEachFullyLoaded();

    decks.push(deck);
  });

  return Promise.all(decks);
};