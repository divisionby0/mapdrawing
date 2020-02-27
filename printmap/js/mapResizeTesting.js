var normalSizeWidth = 500;
var bigSizeWidth = 2481;
var renderMap;
var aspectRatio = 1.414;
var zoom = 11;

var center = [37.6190165137685, 55.7554396083260];
var style = "mapbox://styles/divby0/ck73atvo0240k1iqwcaeu4pog";
var bearing = 0;
var pitch = 0;

var mapcenter;
var mapbounds = null;

var state = "INIT";

$(document).ready(function () {
    createListeners();
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';
    var mapTilerAccessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';

    onNormalSizeButtonClicked();
});


function createListeners(){
    $("#normalSizeButton").click(()=>onNormalSizeButtonClicked());
    $("#bigSizeButton").click(()=>onBigSizeButtonClicked());
}

function onNormalSizeButtonClicked(){
    
    removeMap();
    
    $("#mapContainer").width(normalSizeWidth);
    $("#mapContainer").css("height", normalSizeWidth*aspectRatio+"px");
    
    var parameters = {container: "mapContainer",
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        attributionControl: false
    };
    
    if(mapcenter){
        parameters.center = mapcenter;
    }
    else{
        parameters.center = center;
    }
    
    if(mapbounds){
        parameters.bounds = mapbounds;
    }
    renderMap = new mapboxgl.Map(parameters);
    
    renderMap.on('moveend', boundsload);
    renderMap.on('zoomend', zoomingComplete);
    window.setTimeout(()=>resize(), 500);
}


function onBigSizeButtonClicked(){
    removeMap();
    if(state!="NORMAL"){
        state = "FIRST_RESIZE";
    }
    
    $("#mapContainer").width(bigSizeWidth);
    $("#mapContainer").css("height", bigSizeWidth*aspectRatio+"px");

    renderMap = new mapboxgl.Map({
        container: "mapContainer",
        center: mapcenter,
        zoom: zoom,
        style: style,
        bearing: bearing,
        pitch: pitch,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
        attributionControl: false,
        bounds:mapbounds
    });
    
    renderMap.on('moveend', boundsload); // and then update proximity each time the map moves
    renderMap.on('zoomend', zoomingComplete); // and then update proximity each time the map moves
    window.setTimeout(()=>resize(), 500);
}

function removeMap(){
    $("#mapContainer").empty();
    if(renderMap){
        renderMap.remove();
    }
}

function zoomingComplete(){
    zoom = renderMap.getZoom();

    if(state == "FIRST_RESIZE"){
        state = "NORMAL";
        renderMap.setZoom(zoom+0.001);
    }
}

function boundsload(){
    mapcenter = renderMap.getCenter();
    mapbounds = renderMap.getBounds();
}

function resize(){
    renderMap.resize();
    boundsload();
    zoomingComplete();
}