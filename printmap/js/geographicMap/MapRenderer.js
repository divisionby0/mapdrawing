var renderMap;
var parameters;
var image;
var printWidth = 2481;
var printHeight = 3509;

function render($, _parameters, left, right, top, bottom){
    console.log("render left=",left, "right=", right, "top=", top, "bottom=",bottom);
    parameters = _parameters;
    parameters.container = "mapImageContainer";
    
    destroyPrintMap();

    $("#"+parameters.container).show();
    
    var containerWidth = printWidth - printWidth/100*parseFloat(left) - printWidth/100*parseFloat(right);
    var containerHeight = printHeight - printHeight/100*parseFloat(top) - printHeight/100*parseFloat(bottom);
    
    $("#"+parameters.container).width(containerWidth);
    $("#"+parameters.container).height(containerHeight);
    
    renderMap = new mapboxgl.Map(parameters);

    window.setTimeout(updateMap(), 500);
}

function updateMap(){
    renderMap.resize();
    generatePrintSize();
}

function generatePrintSize(){
    renderMap.once('idle', function() {

        var b64Text = renderMap.getCanvas().toDataURL();
        b64Text = b64Text.replace('data&colon;image/png;base64,','');
        var base64Data = b64Text;

        var newImg = document.createElement('img');
        //newImg.className = "printsizeImage";
        newImg.src = base64Data;

        destroyPrintMap();
        EventBus.dispatchEvent("RENDER_PRINT_SIZE_RESULT", newImg);
        
        /*
        renderMap.getCanvas().toBlob(function(blob) {
            
            var img = buildImage(blob);

            destroyPrintMap();
            
            EventBus.dispatchEvent("RENDER_PRINT_SIZE_RESULT", img);
        });
        */
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

