var newWidth;
var newHeight;
var style;
var srcMap;
var coeff = 1;
var j$;
var dpi = 96;

function generateMap($, w, h, _style, _srcMap) {
    j$ = $;
    srcMap = _srcMap;
    
    'use strict';
    newWidth = w;
    newHeight = h;
    style = _style;
    srcMap = _srcMap;
    
    console.log("srcMap=",srcMap);

    var zoom = srcMap.getZoom();
    var center = srcMap.getCenter();
    var bearing = srcMap.getBearing();
    var pitch = srcMap.getPitch();

    createPrintMap(dpi, zoom, center, bearing, pitch);
}

function createPrintMap(dpi, zoom, center, bearing, pitch) {
    'use strict';

    /*
    // Calculate pixel ratio
    var actualPixelRatio = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function() {return dpi / 96}
    });
    */
    
    // Render map
    var renderMap = new mapboxgl.Map({
        container: "map",
        center: center,
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        interactive: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        attributionControl: false
    });
    
    renderMap.once('idle', function() {
        renderMap.getCanvas().toBlob(function(blob) {
            saveAs(blob, 'map.png');
        });

        /*
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return actualPixelRatio}
        });
        */
    });
}

function toPixels(length, unit) {
    'use strict';
    var conversionFactor = 96;
    if (unit == 'mm') {
        conversionFactor /= 25.4;
    }

    return conversionFactor * length + 'px';
}
