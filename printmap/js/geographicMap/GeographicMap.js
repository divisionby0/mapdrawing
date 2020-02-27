///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
var GeographicMap = (function () {
    function GeographicMap(j$, selfId, parameters) {
        this.j$ = j$;
        this.selfId = selfId;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;
        if (parameters.coeff) {
            this.coeff = parameters.coeff;
        }
        else {
            this.coeff = 1;
        }
        this.zoom = this.zoom;
        this.createMap();
    }
    GeographicMap.prototype.setZoom = function (zoom) {
        this.zoom = parseInt(zoom);
        if (this.map) {
            this.map.setZoom(this.zoom);
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
            this.map.setStyle(this.currentStyle);
        }
    };
    GeographicMap.prototype.resize = function (w, h) {
        var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv = document.getElementById(this.selfId);
        mapDiv.style.width = w;
        mapCanvas.style.width = h;
        this.map.resize();
    };
    GeographicMap.prototype.createMap = function () {
        var _this = this;
        try {
            this.map = new mapboxgl.Map({
                container: this.selfId,
                center: this.position,
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle,
                attributionControl: false,
                preserveDrawingBuffer: true
            });
            this.map.on('load', function () { return _this.onMapLoaded(); });
            this.j$(".mapboxgl-control-container").hide();
            this.map.on('moveend', function () { return _this.onMapMoved(); });
            this.onMapMoved();
        }
        catch (e) {
            alert(e.message);
        }
    };
    GeographicMap.prototype.onMapMoved = function () {
        var center = this.map.getCenter().toArray();
        var lat = parseFloat(center[1]).toFixed(7);
        var lng = parseFloat(center[0]).toFixed(7);
        var coord = [lat, lng];
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
    };
    GeographicMap.prototype.onMapLoaded = function () {
        console.log("MAP loaded zoom=", this.map.getZoom());
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, { map: this.map, style: this.currentStyle });
    };
    GeographicMap.prototype.onZoomEnded = function () {
        console.log("MAP onZoomEnded zoom=", this.map.getZoom());
    };
    GeographicMap.ON_MAP_LOADED = "ON_MAP_LOADED";
    return GeographicMap;
}());
//# sourceMappingURL=GeographicMap.js.map