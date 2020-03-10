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
        
        currentTemplate = templates.get(currentTemplateIndex);
        printWidth = currentTemplate.getPrintWidth();
        printHeight = currentTemplate.getPrintHeight();

        var defaultCityData = currentTemplate.getDefaultCity();
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, defaultCityData);

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
    EventBus.addEventListener("RENDER_PRINT_SIZE_RESULT", (data)=>onPrintSizeImageReady(data));
    EventBus.dispatchEvent("RENDER_PRINT_SIZE",null);
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

function onPrintSizeImageReady(data){
    console.log("onPrintSizeImageReady");
    EventBus.removeEventListener("RENDER_PRINT_SIZE_RESULT", (data)=>onPrintSizeImageReady(data));
    var imgObject = $(data);
    
    var src = imgObject.attr("src");
    
    var changedTemplateLayers = new List("layers");
    
    var changedTemplate = new Template("","", 2481, 3509, changedTemplateLayers, 1.414);
    
    var layersIterator = currentTemplate.getLayersIterator();
    
    while(layersIterator.hasNext()){
        var layer = layersIterator.next();
        
        if(layer.getType()!=LayerType.MAP_LAYER_TYPE){
            changedTemplateLayers.add(layer); 
        }
        else{
            var left = layer.getLeft();
            var right = layer.getRight();
            var top = layer.getTop();
            var bottom = layer.getBottom();
            var border = layer.getBorder();
            
            var blobImageLayer = new BlobImageTemplateLayer("backgroundImage", 1.414, LayerType.BLOB_IMAGE_LAYER_TYPE, src, left, top, right, bottom, false, border);
            changedTemplateLayers.add(blobImageLayer);
        }
    }

    var printWidth = currentTemplate.getPrintWidth();
    var printHeight = currentTemplate.getPrintHeight();

    var templateWidth = $("#templateElement").outerWidth();

    var coeff = printWidth/templateWidth;

    createTemplateElement(changedTemplate, "printMapContainer", "printMap", coeff);
    
    setTimeout(createPrintImage(), 1000);
}

function hideMapContainer(){
    $("#printMapContainer").empty();
    $("#printMapContainer").hide();
    $("#mapImageContainer").empty();
    $("#mapImageContainer").hide();
}

function createPrintImage(){
    $("#templateElement").hide();
    $("#printMapContainer").show();
    $("#printMapContainer").width(2481);
    $("#printMapContainer").height(3509);
    
    html2canvas(document.querySelector("#printMapContainer"),{letterRendering: 1, allowTaint : true}).then(function(canvas){
        canvas.toBlob(function(blob) {
            $("#templateElement").show();
            setTimeout(hideMapContainer, 2000);
            saveAs(blob, 'map.png');
        });

        $("#templateElement").show();
    });
}