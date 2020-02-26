var GeographicMap = (function () {
    function GeographicMap(j$, parameters) {
        this.j$ = j$;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;
    }
    GeographicMap.prototype.setZoom = function (zoom) {
        if (this.map) {
            this.map.setZoom(zoom);
        }
    };
    GeographicMap.prototype.setPosition = function (position) {
        this.position = position;
        if (this.map) {
            this.map.flyTo({ center: this.position });
        }
        else {
            console.log("map not created yet");
        }
    };
    GeographicMap.prototype.setStyle = function (style) {
        this.currentStyle = style;
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        this.createMap();
    };
    GeographicMap.prototype.createMap = function () {
        var _this = this;
        console.log("position=", this.position);
        try {
            this.map = new mapboxgl.Map({
                container: 'map',
                center: this.position,
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle
            });
            this.map.on('moveend', function () { return _this.onMapMoved(); });
            this.onMapMoved();
        }
        catch (e) {
            alert(e.message);
        }
    };
    GeographicMap.prototype.onMapMoved = function () {
        var center = this.map.getCenter().toArray();
        var zoom = parseFloat(this.map.getZoom()).toFixed(6);
        var lat = parseFloat(center[1]).toFixed(6);
        var lng = parseFloat(center[0]).toFixed(6);
        console.log("lat=", lat, "lng=", lng);
    };
    return GeographicMap;
}());
//# sourceMappingURL=GeographicMap.js.map