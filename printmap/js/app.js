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
var currentCity;

var printWidth;
var printHeight;

var geocodingService;

$(document).ready(function () {
    EventBus.addEventListener(TemplateLoader.ON_DATA_LOADED, function(data){
        templates = parser.parse(data);

        EventBus.dispatchEvent("ON_TEMPLATES_LOADED", templates);
        
        currentTemplate = templates.get(currentTemplateIndex);
        printWidth = currentTemplate.getPrintWidth();
        printHeight = currentTemplate.getPrintHeight();

        var defaultCityData = currentTemplate.getDefaultCity();
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, defaultCityData);
        
        createTemplateElement(currentTemplate, "templateElement", "map12", 1);
        
        createSearchCity();
        getCurrentLocation();
    });
    
    EventBus.addEventListener(GeographicMap.ON_MAP_LOADED, (data)=>onMapLoaded(data));
    
    createTemplateEditor();
    createTemplatesList();
    
    EventBus.addEventListener(Template.ON_SELECT, function(index){

        if(index==currentTemplateIndex){
            return;
        }

        $("#templateElement").empty();

        currentTemplateIndex = index;

        currentTemplate = templates.get(currentTemplateIndex);
        currentTemplate.setCity(currentCity);
        EventBus.dispatchEvent("TEMPLATE_CHANGED", currentTemplate);

        createTemplateElement(currentTemplate, "templateElement", "map12", 1);
    });
    
    parser = new TemplatesParser($);
    
    templateLoader = new TemplateLoader($);
    templateLoader.load(templatesUrl);
});

function getCurrentLocation(){
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function success(position) {
                currentCoord = [position.coords.latitude, position.coords.longitude];
                console.log('latitude '+ position.coords.latitude+ ' longitude '+ position.coords.longitude);

                EventBus.addEventListener(GeocodingService.ON_REVERSED_GEOCODING_RESULT, onCityByCoordinatesGeocodingResult);

                geocodingService.getCity(position.coords.latitude, position.coords.longitude);
            },
            function error(error_message) {
                console.error('An error has occured while retrieving location'+ error_message.message);
            }
        );
    } else {
        console.error('geolocation is not enabled on this browser');
    }
}

function onCityByCoordinatesGeocodingResult(data){
    console.log("onCityByCoordinatesGeocodingResult data=",data);

    var resultParser = new SearchCityResultParses();
    var resultData = resultParser.parse(data);

    console.log("resultData:",resultData);

    var firstCity = getFirstCity(resultData);

    console.log("first city:",firstCity);

    currentTemplate.setCity(firstCity.name);
    currentTemplate.setLat(firstCity.coord[0]);
    currentTemplate.setLng(firstCity.coord[1]);

    currentCity = firstCity.name;

    EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, firstCity);

    EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, firstCity.coord);
}

function createTemplatesList(){
    var templatesListView = new TemplatesListView($);
    var templatesListModel = new TemplatesListModel(templatesListView);
    new TemplatesListController(templatesListModel);
}

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
    geocodingService = new GeocodingService($);
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
    
    setTimeout(createPrintImage(), 300);
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
    $("#printMapContainer").width(printWidth);
    $("#printMapContainer").height(printHeight);
    
    html2canvas(document.querySelector("#printMapContainer"),{letterRendering: 1, allowTaint : true}).then(function(canvas){
        canvas.toBlob(function(blob) {
            $("#templateElement").show();
            setTimeout(hideMapContainer, 300);
            saveAs(blob, 'map.png');
        });

        $("#templateElement").show();
    });
}

function getFirstCity(data){
    var cities = data.collection;
    var firstCityData = cities.get(0);

    var coord = firstCityData.coord;
    var cityName = firstCityData.name;
    var country = firstCityData.country;

    if(firstCityData){
        return {coord:coord, country:country, city:cityName};
    }
    else{
        console.error("Did'n find template default city");
    }
}