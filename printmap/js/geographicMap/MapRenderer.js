var renderMap;
var parameters;
var image;
function render($, _parameters){
    parameters = _parameters;
    parameters.container = "printMapContainer";
    
    destroyPrintMap();
    
    $("#"+parameters.container).width(2481);
    $("#"+parameters.container).height(3508);
    
    renderMap = new mapboxgl.Map(parameters);

    window.setTimeout(updateMap(), 500);
}

function updateMap(){
    renderMap.resize();
    generatePrintSize();
}

function generatePrintSize(){
    renderMap.once('idle', function() {
        renderMap.getCanvas().toBlob(function(blob) {
            
            var img = buildImage(blob);

            destroyPrintMap();
            
            EventBus.dispatchEvent("RENDER_PRINT_SIZE_RESULT", img);
        });
    });
}

function destroyPrintMap(){
    if(renderMap){
        renderMap.remove();
        renderMap = null;
    }
    
    $("#"+parameters.container).empty();
    //$("#"+parameters.container).width(0);
    //$("#"+parameters.container).height(0);
}

function buildImage(blob){
    var newImg = document.createElement('img');
    var url = URL.createObjectURL(blob);

    newImg.onload = function() {
        URL.revokeObjectURL(url);
    };

    newImg.className = "printsizeImage";
    newImg.src = url;
    return newImg;
}

