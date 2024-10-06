// Array to store all listener references
var allListeners = [];

L.Polyline.addInitHook(function () {
  if (this.options.lazyload) {
    // Setup virtualization after polyline was added
    this.on(
      "add",
      function () {
        this._updateVisibility = function () {
          var map = this._renderer._map;
          var isVisible = map.getBounds().intersects(this.getBounds());
          var wasVisible = this._wasVisible;

          // Add/remove from DOM on change
          if (isVisible !== wasVisible) {
            if (isVisible) {
              // Add polyline to the map
              this._renderer._map.addLayer(this);
            } else {
              // Remove polyline from the map
              this._renderer._map.removeLayer(this);
            }
            this._wasVisible = isVisible;
          }
        };

        // Add event listener for resize, moveend, zoomend
        this._map.on("resize moveend zoomend", this._updateVisibility, this);

        // Track the listener function for removal later
        allListeners.push({
          target: this._map,
          event: "resize moveend zoomend",
          fn: this._updateVisibility,
          context: this,
        });

        this._updateVisibility();
      },
      this
    );
  }
});

L.removeAllListeners = function (polylines = []) {
  if (polylines.length === 0) {
    // No Polylines specified, remove all listeners
    allListeners.forEach(function (listener) {
      listener.target.off(listener.event, listener.fn, listener.context);
    });

    // Clear the array after removing the listeners
    allListeners = [];
  } else {
    // Remove listeners only for the specified Polylines
    allListeners = allListeners.filter(function (listener) {
      if (polylines.includes(listener.context)) {
        listener.target.off(listener.event, listener.fn, listener.context);
        return false; // Remove the listener from the array
      }
      return true; // Keep the listener in the array
    });
  }
};
