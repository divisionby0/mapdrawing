var MapParameters = (function () {
    function MapParameters(style, zoom, center, bounds, bearing, pitch) {
        this.preserveDrawingBuffer = true;
        this.attributionControl = false;
        this.fadeDuration = 0;
        this.style = style;
        this.zoom = zoom;
        this.center = center;
        this.bounds = bounds;
        this.bearing = bearing;
        this.pitch = pitch;
    }
    MapParameters.prototype.getContainer = function () {
        return this.container;
    };
    MapParameters.prototype.setContainer = function (value) {
        this.container = value;
    };
    MapParameters.prototype.getZoom = function () {
        return this.zoom;
    };
    MapParameters.prototype.setZoom = function (value) {
        this.zoom = value;
    };
    MapParameters.prototype.getCenter = function () {
        return this.center;
    };
    MapParameters.prototype.setCenter = function (value) {
        this.center = value;
    };
    MapParameters.prototype.setStyle = function (value) {
        this.style = value;
    };
    MapParameters.prototype.getBounds = function () {
        return this.bounds;
    };
    MapParameters.prototype.setBounds = function (value) {
        this.bounds = value;
    };
    MapParameters.prototype.toObject = function () {
        return { container: this.container,
            center: this.center,
            zoom: this.zoom,
            style: this.style,
            bearing: this.bearing,
            pitch: this.pitch,
            preserveDrawingBuffer: this.preserveDrawingBuffer,
            fadeDuration: this.fadeDuration,
            attributionControl: this.attributionControl,
            bounds: this.bounds
        };
    };
    return MapParameters;
}());
//# sourceMappingURL=MapParameters.js.map