var map;
var lng = 37.62053152262865;
var lat = 55.75240416433388;
var zoom = 11.933242053191053;
var maxSize;

var mapContainerZoomCoeff = 0.7;

var printWidth = 2481;
var printHeight = 3509;

var sourceMapZoomWidthOffset = printWidth - mapContainerZoomCoeff * printWidth;
var sourceMapZoomHeightOffset = printHeight - mapContainerZoomCoeff * printHeight;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';
var mapTilerAccessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';

var form = document.getElementById('config');

var templateLoader;
var parser;
var templates;
var templateBuilder;
var currentTemplate;
var currentTemplateIndex = 0;
var templatesUrl = "../common/templates/mapTemplates.xml";

$(document).ready(function () {

    EventBus.addEventListener(TemplateLoader.ON_DATA_LOADED, function(data){
        templates = parser.parse(data);
        console.log("templates = ",templates);
        
        currentTemplate = templates.get(currentTemplateIndex);

        createSearchCity();
        createTemplateElement(currentTemplate, "templateElement", "map", 1);
    });

    parser = new TemplatesParser($);
    
    templateLoader = new TemplateLoader($);
    templateLoader.load(templatesUrl);
    
    
    /*
    var style = form.styleSelect.value;
    if (style.indexOf('tilehosting') >= 0){
        style += '?key=' + mapTilerAccessToken;
    }
    
    try {
        map = new mapboxgl.Map({
            container: 'map',
            center: [lng, lat],
            zoom: zoom,
            fadeDuration: 0,
            style: style
        });
    } catch (e) {
        var mapContainer = document.getElementById('map');
        mapContainer.parentNode.removeChild(mapContainer);
        document.getElementById('config-fields').setAttribute('disabled', 'yes');
        openErrorModal('This site requires WebGL, but your browser doesn\'t seem' + ' to support it: ' + e.message);
    }
    
    if(map!=null && map!=undefined){
        map.on('moveend', updateLocationInputs);
        map.on('zoomend', updateLocationInputs);
        
        updateLocationInputs();
        createSearchCity();
    }

    $("#styleSelect").change(function(){
        console.log("changed");
        map.setStyle($("#styleSelect").val());
    });
    */
});

function createTemplateElement(template, parentContainerId, selfContainerId, coeff){
    if(templateBuilder){
        templateBuilder.destroy();
        templateBuilder = null;
    }

    templateBuilder = new TemplateBuilder($, template, parentContainerId, selfContainerId, coeff);
}

function createSearchCity(){
    var geocodingService = new GeocodingService($);
    var view = new SearchCityView($);
    var model = new SearchCityModel(view, geocodingService);
    new SearchCityController(model);
}

//
// Errors
//
if (map) {
    var canvas = map.getCanvas();
    var gl = canvas.getContext('experimental-webgl');
    maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
}

var errors = {
    width: {
        state: false,
        msg: 'Width must be a positive number!',
        grp: 'widthGroup'
    },
    height: {
        state: false,
        grp: 'heightGroup'
    },
    dpi: {
        state: false,
        msg: 'DPI must be a positive number!',
        grp: 'dpiGroup'
    }
};

function handleErrors() {
    'use strict';
    var errorMsgElem = document.getElementById('error-message');
    var anError = false;
    var errorMsg;
    for (var e in errors) {
        e = errors[e];
        if (e.state) {
            if (anError) {
                errorMsg += ' ' + e.msg;
            } else {
                errorMsg = e.msg;
                anError = true;
            }
            document.getElementById(e.grp).classList.add('has-error');
        } else {
            document.getElementById(e.grp).classList.remove('has-error');
        }
    }
    if (anError) {
        errorMsgElem.innerHTML = errorMsg;
        errorMsgElem.style.display = 'block';
    } else {
        errorMsgElem.style.display = 'none';
    }
}

function isError() {
    'use strict';
    for (var e in errors) {
        if (errors[e].state) {
            return true;
        }
    }
    return false;
}

if (form.unitOptions[0].checked) {
    // Millimeters
    form.widthInput.value /= 25.4;
    form.heightInput.value /= 25.4;
}

//
// Error modal
//

var origBodyPaddingRight;

function openErrorModal(msg) {
    'use strict';
    var modal = document.getElementById('errorModal');
    document.getElementById('modal-error-text').innerHTML = msg;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    document.getElementById('modalBackdrop').style.height =
        modal.scrollHeight + 'px';
    document.getElementById('modalBackdrop').style.display = 'block';

    if (document.body.scrollHeight > document.documentElement.clientHeight) {
        origBodyPaddingRight = document.body.style.paddingRight;
        var padding = parseInt((document.body.style.paddingRight || 0), 10);
        document.body.style.paddingRight = padding + measureScrollbar() + 'px';
    }
}

function closeErrorModal() {
    'use strict';
    document.getElementById('errorModal').style.display = 'none';
    document.getElementById('modalBackdrop').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = origBodyPaddingRight;
}

function measureScrollbar() {
    'use strict';
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}

//
// Helper functions
//
function toPixels(length) {
    'use strict';
    var unit = form.unitOptions[0].checked ? 'in' : 'mm';
    var conversionFactor = 96;
    if (unit == 'mm') {
        conversionFactor /= 25.4;
    }

    return conversionFactor * length + 'px';
}


//
// High-res map rendering
//

document.getElementById('generate-btn').addEventListener('click', generateMap);

function generateMap() {
    'use strict';

    if (isError()) {
        openErrorModal('The current configuration is invalid! Please ' +
            'correct the errors and try again.');
        return;
    }

    document.getElementById('spinner').style.display = 'inline-block';
    document.getElementById('generate-btn').classList.add('disabled');

    var width = Number(form.widthInput.value);
    var height = Number(form.heightInput.value);

    var dpi = Number(form.dpiInput.value);

    var format = form.outputOptions[0].checked ? 'png' : 'pdf';

    var unit = form.unitOptions[0].checked ? 'in' : 'mm';

    var style = form.styleSelect.value;
    if (style.indexOf('tilehosting') >= 0)
        style += '?key=' + mapTilerAccessToken;

    var zoom = map.getZoom();
    var center = map.getCenter();
    var bearing = map.getBearing();
    var pitch = map.getPitch();

    createPrintMap(width, height, dpi, format, unit, zoom, center, bearing, style, pitch);
}

function createPrintMap(width, height, dpi, format, unit, zoom, center,
                        bearing, style, pitch) {
    'use strict';

    // Calculate pixel ratio
    var actualPixelRatio = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', {
        get: function() {return dpi / 96}
    });

    // Create map container
    var hidden = document.createElement('div');
    hidden.className = 'hidden-map';
    document.body.appendChild(hidden);
    
    var container = document.createElement('div');
    container.style.width = toPixels(width);
    container.style.height = toPixels(height);
    hidden.appendChild(container);

    // Render map
    var renderMap = new mapboxgl.Map({
        container: container,
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
        if (format == 'png') {
            renderMap.getCanvas().toBlob(function(blob) {
                saveAs(blob, 'map.png');
            });
        } else {
            var pdf = new jsPDF({
                orientation: width > height ? 'l' : 'p',
                unit: unit,
                format: [width, height],
                compress: true
            });

            pdf.addImage(renderMap.getCanvas().toDataURL('image/png'),
                'png', 0, 0, width, height, null, 'FAST');

            var title = map.getStyle().name,
                subject = "center: [" + form.lonInput.value  + ", " + form.latInput.value + ", " + form.zoomInput.value + "]",
                attribution = '(c) ' +
                    (form.styleSelect.value.indexOf('mapbox') >= 0 ? 'Mapbox' : 'OpenMapTiles') +
                    ', (c) OpenStreetMap';

            pdf.setProperties({
                title: title,
                subject: subject,
                creator: 'Print Maps',
                author: attribution
            })

            pdf.save('map.pdf');
        }

        renderMap.remove();
        hidden.parentNode.removeChild(hidden);
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return actualPixelRatio}
        });
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('generate-btn').classList.remove('disabled');
    });
}

function updateLocationInputs() {
    var center = map.getCenter().toArray();

    var zoom = parseFloat(map.getZoom()).toFixed(2),
        lat = parseFloat(center[1]).toFixed(4),
        lon = parseFloat(center[0]).toFixed(4);

    form.zoomInput.value = zoom;
    form.latInput.value = lat;
    form.lonInput.value = lon;
}