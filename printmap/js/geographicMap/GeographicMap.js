///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
var GeographicMap = (function () {
    function GeographicMap(j$, selfId, parameters) {
        this.j$ = j$;
        this.selfId = selfId;
        this.zoom = parameters.zoom;
        this.center = parameters.position;
        this.currentStyle = parameters.currentStyle;
        if (parameters.coeff) {
            this.coeff = parameters.coeff;
        }
        else {
            this.coeff = 1;
        }
        if (parameters.bounds) {
            this.bounds = parameters.bounds;
        }
        if (parameters.zoom) {
            this.zoom = parameters.zoom;
        }
        if (parameters.bearing) {
            this.bearing = parameters.bearing;
        }
        if (parameters.pitch) {
            this.pitch = parameters.pitch;
        }
        this.createMap();
    }
    GeographicMap.prototype.setZoom = function (zoom) {
        this.zoom = parseInt(zoom);
        if (this.map) {
            this.map.setZoom(this.zoom);
        }
    };
    GeographicMap.prototype.setPosition = function (position) {
        this.center = position;
        if (this.map) {
            this.map.flyTo({ center: this.center });
        }
        else {
            console.log("map not created yet");
        }
    };
    GeographicMap.prototype.setStyle = function (style) {
        this.currentStyle = style;
        if (this.map) {
            this.map.setStyle(this.currentStyle);
        }
    };
    GeographicMap.prototype.resize = function (w, h) {
        /*
        var mapCanvas:any = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv:any = document.getElementById(this.selfId);

        mapDiv.style.width = w;
        mapCanvas.style.width = h;
        */
        this.map.resize();
    };
    GeographicMap.prototype.createMap = function () {
        var _this = this;
        var parameters = {
            container: this.selfId,
            style: this.currentStyle,
            preserveDrawingBuffer: true,
            fadeDuration: 0,
            attributionControl: false
        };
        if (this.bounds) {
            parameters.bounds = this.bounds;
        }
        if (this.zoom) {
            parameters.zoom = this.zoom;
        }
        if (this.center) {
            parameters.center = this.center;
        }
        if (this.bearing) {
            parameters.bearing = this.bearing;
        }
        if (this.pitch) {
            parameters.pitch = this.pitch;
        }
        console.log("map parameters: ", parameters);
        try {
            this.map = new mapboxgl.Map(parameters);
            this.map.on('load', function () { return _this.onMapLoaded(); });
            this.j$(".mapboxgl-control-container").hide();
            this.map.on('moveend', function () { return _this.onMapChanged(); });
            this.map.on('zoomend', function () { return _this.onMapChanged(); });
            window.setTimeout(function () { return _this.map.resize(); }, 500);
        }
        catch (e) {
            alert(e.message);
        }
    };
    GeographicMap.prototype.onMapChanged = function () {
        var center = this.map.getCenter().toArray();
        var lat = parseFloat(center[1]).toFixed(7);
        var lng = parseFloat(center[0]).toFixed(7);
        var coord = [lat, lng];
        this.center = this.map.getCenter();
        this.bounds = this.map.getBounds();
        this.zoom = this.map.getZoom();
        this.bearing = this.map.getBearing();
        this.pitch = this.map.getPitch();
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
        EventBus.dispatchEvent(GeographicMap.ON_MAP_CHANGED, { center: this.center, bounds: this.bounds, zoom: this.zoom, style: this.currentStyle, bearing: this.bearing, pitch: this.pitch });
    };
    GeographicMap.prototype.onMapLoaded = function () {
        console.log("MAP loaded zoom=", this.map.getZoom());
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, { map: this.map, style: this.currentStyle });
    };
    GeographicMap.prototype.onZoomEnded = function () {
        console.log("MAP onZoomEnded zoom=", this.map.getZoom());
    };
    GeographicMap.ON_MAP_LOADED = "ON_MAP_LOADED";
    GeographicMap.ON_MAP_CHANGED = "ON_MAP_CHANGED";
    return GeographicMap;
}());
//# sourceMappingURL=GeographicMap.js.map