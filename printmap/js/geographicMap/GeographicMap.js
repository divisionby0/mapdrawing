///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
///<reference path="../../../common/template/layer/geographicMap/MapParameters.ts"/>
var GeographicMap = (function () {
    function GeographicMap(j$, parameters) {
        var _this = this;
        this.j$ = j$;
        this.parameters = parameters;
        this.createMap();
        EventBus.addEventListener("RENDER_PRINT_SIZE", function () { return _this.onRenderPrintSizeRequest(); });
    }
    GeographicMap.prototype.setPosition = function (position) {
        this.center = position;
        this.parameters.setCenter(position);
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
        var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv = document.getElementById(this.parameters.getContainer());
        mapDiv.style.width = w;
        mapDiv.style.height = h;
        mapCanvas.style.width = w;
        mapCanvas.style.height = h;
        if (this.map) {
            this.map.resize();
            this.updateMap();
        }
    };
    GeographicMap.prototype.createMap = function () {
        var _this = this;
        try {
            this.map = new mapboxgl.Map(this.parameters.toObject());
            this.map.on('load', function () { return _this.onMapLoaded(); });
            this.j$(".mapboxgl-control-container").hide();
            this.updateMap();
            window.setTimeout(function () { return _this.updateMap(); }, 500);
            this.map.on('moveend', function () { return _this.onMapChanged(); });
            this.map.on('zoomend', function () { return _this.onMapChanged(); });
        }
        catch (e) {
            console.error("ERROR: ", e);
            alert(e.message);
        }
    };
    GeographicMap.prototype.updateMap = function () {
        this.map.resize();
        this.map.jumpTo({ center: this.parameters.getCenter() });
        if (this.parameters.getBounds()) {
            this.map.fitBounds(this.parameters.getBounds());
        }
        this.map.setZoom(this.parameters.getZoom());
    };
    GeographicMap.prototype.onMapChanged = function () {
        this.parameters.setZoom(this.map.getZoom());
        this.parameters.setCenter(this.map.getCenter());
        this.parameters.setBounds(this.map.getBounds());
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, [this.map.getCenter().lng, this.map.getCenter().lat, this.map.getCenter(), this.map.getZoom(), this.map.getBounds()]);
    };
    GeographicMap.prototype.onMapLoaded = function () {
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, { map: this.map, style: this.currentStyle });
    };
    GeographicMap.prototype.onRenderPrintSizeRequest = function () {
        render(this.j$, this.parameters.toObject());
    };
    GeographicMap.ON_MAP_LOADED = "ON_MAP_LOADED";
    GeographicMap.ON_MAP_CHANGED = "ON_MAP_CHANGED";
    return GeographicMap;
}());
//# sourceMappingURL=GeographicMap.js.map