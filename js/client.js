/**
 * Check that the document ready state is complete before creating controller instance.
 */
document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    // console.log("document loaded");

    // Toggle loading status and notifications state
    MosaicSingleton.Util.updateNotifications("");
    MosaicSingleton.Util.toggleLoading(false);

    // Instantiate MosaicController object and register for events
    var mosaicController = new MosaicController();
    mosaicController.registerForEvents();
  }
}
