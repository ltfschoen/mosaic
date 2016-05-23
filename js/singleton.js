var MosaicSingleton = {
  // Utility Methods
  Util: {
    updateNotifications: function(message) {
      var notificationElem = document.getElementById("notifications");
      if (message) { 
        notificationElem.innerHTML = message;
      }
    },
    toggleLoading: function(state) {
      var loadingElem = document.getElementById("loading");
      if (state == true) { 
        loadingElem.style.opacity = "1";
      } else {
        loadingElem.style.opacity = "0";
      }
    },
    resizeGivenImageToDivisibleByTileSize: function(na, callback) {
      var img = document.getElementById('image-uploaded');

      // console.log("exist dims: " + img.width + ", " + img.height);

      /**
       * Reduce size of uploaded image to be divisible by Tile Dimension without remainder.
       * If the image width or height in pixels is less than the default tile width then use 
       * the default instead of no tiles being shown at all
       */
      if (img.width >= TILE_WIDTH) {
        var remainderWidth = img.width % TILE_WIDTH;
        img.width = img.width - remainderWidth;
      } else {
        img.width = TILE_WIDTH;
      }

      if (img.height >= TILE_HEIGHT) {
        var remainderHeight = img.height % TILE_HEIGHT;
        img.height = img.height - remainderHeight;
      } else {
        img.height = TILE_HEIGHT;
      }

      // console.log("new dims: " + img.width + ", " + img.height);
      callback();
    },
    splitGivenImageIntoTiles: function(uploadedImageElement, 
                                uploadImageElementColTilesQty,
                                uploadImageElementRowTilesQty,
                                callback) {

      var imagePieces = [],
          numColsToCut = uploadImageElementColTilesQty,
          numRowsToCut = uploadImageElementRowTilesQty,
          widthOfOnePiece = TILE_WIDTH,
          heightOfOnePiece = TILE_HEIGHT;
      // Slice up image into grid and assign to array.
      // imagePieces shall contain data of all image pieces
      for(var x = 1; x <= numColsToCut; ++x) {
        for(var y = 1; y <= numRowsToCut; ++y) {
          var canvas = document.createElement('canvas');
          canvas.width = widthOfOnePiece;
          canvas.height = heightOfOnePiece;
          var context = canvas.getContext('2d');

          // Draw Image using uploaded image file
          // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          context.drawImage(uploadedImageElement,
                           x * widthOfOnePiece,
                           y * heightOfOnePiece, 
                           widthOfOnePiece, 
                           heightOfOnePiece, 
                           0, 
                           0, 
                           canvas.width, 
                           canvas.height);
          imagePieces.push(canvas.toDataURL());
        }
      }
      callback(imagePieces);
    },
    computeAverageTileColourForImage: function(img, callback) {

      // HTML5 Canvas API to analyse pixels using ImageData interface (width, height, and array of pixels)
      var canvas = document.createElement('canvas');

      // Set the height and width of the canvas element to the image piece dimensions (i.e. 16x16)
      var height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
      var width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
      var context = canvas.getContext && canvas.getContext('2d');
      var rgb = {r:102,g:102,b:102}; // Setting base colour is fallback for non-compliant browsers
      var pixelInterval = 1; // Inspect each single pixel in the image
      var count = 0;
      var i = -4; 
      var data;
      var length;

      // Return the base colour for non-compliant browsers
      if (!context) { return rgb; }

      // image, dx, dy
      context.drawImage(img, 0, 0);

      try {
        // Method getImageData of Canvas 2D API returns ImageData object of pixel data for area of canvas
        // in rectangle starting at (sx, sy) and dimensions (sw, sh)
        // sx, sy, sw, sh
        data = context.getImageData(0, 0, width, height);
      } catch(e) {
        // FIXME: Firefox error here is:
        // "Error: IndexSizeError: Index or size is negative or greater than the allowed amount"
        // alert("Error: " + e);
        return rgb;
      }

      data = data.data;

      // console.log(data);

      length = data.length;

      /**
       * Loop through each pixel of the imageData
       * imageData is an Uint8ClampedArray representing a one-dimensional array
       * containing the data in RGBa order, with integer values between 0 and 255 (included).
       * Each imageData.data canvas pixel array contains each pixels RGBa data of the form:
       * data = [pixel1_red, pixel1_green, pixel1_blue, ...]
       * We are only interested in retrieving the first 3 elements of containing the RGB values
       */

      for(var i = 0; i < length; i += 4) {
      // while ((i += pixelInterval * 4) < length) {
        count++;
        rgb.r += data[i];
        rgb.g += data[i + 1];
        rgb.b += data[i + 2];
      }

      // Floor average values to get correct rgb values (ie: round number values)
      rgb.r = Math.floor(rgb.r/count);
      rgb.g = Math.floor(rgb.g/count);
      rgb.b = Math.floor(rgb.b/count);

      // console.log("rgb avg: " + rgb.r + "," + rgb.g + "," + rgb.b);

      var hex = this.rgbToHexNum(rgb.r, rgb.g, rgb.b);

      callback(hex);
    },
    componentToHex: function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHexNum: function(r, g, b) {
      var hex = this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
      // console.log("hex: " + hex);
      return hex;
    }
  },
  // AJAX Methods
  Ajax: {
    fetchSvgTileForHex: function(hex, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.responseXML.documentElement.nodeName == "svg") {
          var stringContainingXMLSourceDocumentElement = xhr.responseXML.documentElement;
          // console.log("http response elem: " + stringContainingXMLSourceDocumentElement);
          
          /**
           * Creates copy of node from external XML document (of an SVG) retrieved from
           * endpoint so it can be inserted into the DOM. Set the second parameter to 'true'
           * to performs a deep clone and fetch the necessary ellipse element
           * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode
           */
          var svgNode = document.importNode(stringContainingXMLSourceDocumentElement, true);
          // console.log("svg node str: " + svgNode);

          callback(svgNode);
        }
      }
      xhr.onerror = function() {
        // console.log("Error while getting XML.");
      }
      // RESTful endpoint to retrieve the hex colour matching the average colour of each image pieces
      xhr.open("GET", "http://localhost:8765/color/" + hex);
      xhr.responseType = "document";
      xhr.send();
    }
  }
};