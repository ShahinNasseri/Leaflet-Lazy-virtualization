L.Polyline.addInitHook(function() {
  if (this.options.lazyload) {
    // setup virtualization after polyline was added
    this.on('add', function() {

      this._updateVisibility = function() {
        var map = this._renderer._map;
        var isVisible = map.getBounds().intersects(this.getBounds());
        var wasVisible = this._wasVisible;

        // add/remove from DOM on change
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

      // on map size change, remove/add polyline from/to map
      this._map.on('resize moveend zoomend', this._updateVisibility, this);
      this._updateVisibility();

    }, this);
  }
});
