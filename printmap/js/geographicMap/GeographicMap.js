///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
var GeographicMap = (function () {
    function GeographicMap(j$, parameters) {
        this.placementHorizontal = false;
        this.j$ = j$;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;
        this.createMap();
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
            this.map.setStyle(this.currentStyle);
        }
    };
    GeographicMap.prototype.resize = function (w, h) {
        var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv = document.getElementById('map');
        mapDiv.style.width = w;
        mapCanvas.style.width = h;
        this.map.resize();
    };
    GeographicMap.prototype.createMap = function () {
        var _this = this;
        try {
            console.log("create map pos=", this.position);
            this.map = new mapboxgl.Map({
                container: 'map',
                center: this.position,
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle,
                attributionControl: false
            });
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
        var lat = parseFloat(center[1]).toFixed(13);
        var lng = parseFloat(center[0]).toFixed(13);
        var coord = [lat, lng];
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
    };
    return GeographicMap;
}());
//# sourceMappingURL=GeographicMap.js.map