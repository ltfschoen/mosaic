function Deck(deck, preloader, index) {
    // console.log("deck.length: " + deck.length);
    // console.log("Deck data: " + deck + " for index: " + index);

    // Call queue method from preloader, passing deck of image pieces with
    // response in callback function when each deck added to the queue
    preloader.queue(deck, index)
        .then(function () {
          // console.log('Deck loaded: ' + index);
        })
    .catch(console.error.bind(console));
}