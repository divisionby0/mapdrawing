var map;
var lng = 37.62053152262865;
var lat = 55.75240416433388;
var zoom = 11.933242053191053;
var maxSize;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';
var mapTilerAccessToken = 'pk.eyJ1IjoiZGl2YnkwIiwiYSI6ImNrNjZuNjU3eDFpNzAzbXF3cm91dmJ6bjQifQ.v2YMxI4B1W4iMrevGH95Uw';

var templateLoader;
var parser;
var templates;
var templateBuilder;
var currentTemplate;
var currentTemplateIndex = 0;
var templatesUrl = "../common/templates/mapTemplates.xml";
var currentMap;
var currentStyle;

var printWidth;
var printHeight;


$(document).ready(function () {
    EventBus.addEventListener(TemplateLoader.ON_DATA_LOADED, function(data){
        templates = parser.parse(data);
        console.log("templates = ",templates);
        
        currentTemplate = templates.get(currentTemplateIndex);
        printWidth = currentTemplate.getPrintWidth();
        printHeight = currentTemplate.getPrintHeight();
        

        createSearchCity();
        createTemplateElement(currentTemplate, "templateElement", "map12", 1);
    });

    EventBus.addEventListener(GeographicMap.ON_MAP_LOADED, (data)=>onMapLoaded(data));
    
    createTemplateEditor();
    
    parser = new TemplatesParser($);
    
    templateLoader = new TemplateLoader($);
    templateLoader.load(templatesUrl);
});

function onMapLoaded(data){
    currentMap = data.map;
    currentStyle = data.style;
}

function exportImage(){
    var currentStyle = "mapbox://styles/divby0/ck73atvo0240k1iqwcaeu4pog";
    generateMap($, printWidth, printHeight, currentStyle, currentMap);
}

function getPrintImage(){

    /*
    var srcCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
    console.log("srcCAnvas = ",srcCanvas);
    resample_single(srcCanvas, 2431,3508, true);
    console.log("resized");
    */

    /*
    html2canvas(document.querySelector("#printImageContainer")).then(function(canvas){
        canvas.toBlob(function(blob) {
            console.log("to save");
            saveAs(blob, 'map.png');
        });

        //tempContainer.empty();
        //tempContainer.remove();
        //tempContainer = null;
    })
    */
}

function createTemplateEditor(){
    var view = new GeographicEditorView($);
    var model = new TemplateEditorModel(view);
    new TemplateEditorController(model);
}

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