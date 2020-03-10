///<reference path="Template.ts"/>
///<reference path="layer/DivTemplateLayer.ts"/>
///<reference path="layer/TextTemplateLayer.ts"/>
///<reference path="layer/ImageTemplateLayer.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/BorderCircleTemplateLayer.ts"/>
///<reference path="layer/starmap/StarmapLayerModel.ts"/>
///<reference path="layer/CityTemplateLayer.ts"/>
///<reference path="layer/CoordinatesTemplateLayer.ts"/>
///<reference path="layer/DateTimeTemplateLayer.ts"/>
///<reference path="layer/starmap/StarmapLayerController.ts"/>
///<reference path="layer/geographicMap/MapLayerModel.ts"/>
///<reference path="layer/geographicMap/MapLayerController.ts"/>
///<reference path="layer/CountryTemplateLayer.ts"/>
///<reference path="layer/LabelsContainerTemplateLayer.ts"/>
///<reference path="layer/MapCityTemplateLayer.ts"/>
///<reference path="layer/MapCountryTemplateLayer.ts"/>
///<reference path="layer/MapCoordinatesTemplateLayer.ts"/>
class TemplatesParser{
    private j$:any;

    private _that:any;
    
    constructor(j$:any){
        this.j$ = j$;
        this._that = this;
    }
    
    public parse(data:string):List<Template> {

        var parser:any = new DOMParser();
        var xmlDoc:any = parser.parseFromString(data,"text/xml");

        var collection:List<Template> = new List<Template>("templates");

        var templates:any[] = xmlDoc.getElementsByTagName("template");
        var total:number = templates.length;
        var i:number;
        var j:number;

        for(i=0; i<total; i++){
            var templateData:any = templates[i];

            var name:string = templateData.getAttribute("name");
            var size:string = templateData.getAttribute("printSize");
            var preview:string = templateData.getAttribute("preview");
            var aspectRatio:number = parseFloat(templateData.getAttribute("aspectRatio"));

            var wh:string[] = size.split("x");
            var width:number = parseInt(wh[0]);
            var height:number = parseInt(wh[1]);
            
            var layers:List<TemplateLayer> = new List<TemplateLayer>("layers");
            
            var layersData:any[] = templateData.getElementsByTagName("layer");

            var totalLayers:number = layersData.length;

            for(j=0; j<totalLayers; j++){
                var layerData:any = layersData[j];
                var id:string = layerData.getAttribute("id");
                var type:string = layerData.getAttribute("type");
                var left:string = layerData.getAttribute("left");
                var top:string = layerData.getAttribute("top");
                var right:string = layerData.getAttribute("right");
                var bottom:string = layerData.getAttribute("bottom");
                var changeable:any = layerData.getAttribute("changeable");
                var border:string = layerData.getAttribute("border");
                
                if(changeable == null){
                    changeable = false;
                }
                else{
                    if(changeable == "true"){
                        changeable = true;
                    }
                    else if(changeable == "false"){
                        changeable = false;
                    }
                }
                
                var templateLayer:TemplateLayer;
                
                switch(type){
                    case LayerType.DIV_LAYER_TYPE:
                        var backgroundColor:string = layerData.getAttribute("backgroundColor");
                        var backgroundAlpha:string = layerData.getAttribute("backgroundAlpha");
                        
                        if(left == null && right == null && top == null && bottom == null){
                            left = "0";
                            right = "0";
                            top = "0";
                            bottom = "0";
                        }
                        templateLayer = new DivTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border);
                        layers.add(templateLayer);
                        break;
                    case LayerType.TEXT_LAYER_TYPE:
                        var text:string = layerData.childNodes[0].nodeValue.toUpperCase();
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");
                        
                        templateLayer = new TextTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;

                    case LayerType.CITY_LAYER_TYPE:
                        var text:string;
                        try{
                            text = layerData.childNodes[0].nodeValue.toUpperCase();
                        }
                        catch(error){
                            text = "";
                        }

                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new CityTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;

                    case LayerType.MAP_CITY_LAYER_TYPE:

                        var text:string;
                        try{
                            text = layerData.childNodes[0].nodeValue.toUpperCase();
                        }
                        catch(error){
                            text = "";
                        }
                        console.log("text=",text);

                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new MapCityTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;

                    case LayerType.COUNTRY_LAYER_TYPE:
                        var text:string;
                        try{
                            text= layerData.childNodes[0].nodeValue.toUpperCase();
                        }
                        catch(error){
                            text = "";
                        }
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new CountryTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;
                    case LayerType.MAP_COUNTRY_LAYER_TYPE:
                        var text:string;
                        try{
                            text= layerData.childNodes[0].nodeValue.toUpperCase();
                        }
                        catch(error){
                            text = "";
                        }
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new MapCountryTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;

                    case LayerType.COORDINATES_LAYER_TYPE:
                        var text:string;
                        try{
                            text= layerData.childNodes[0].nodeValue;
                        }
                        catch(error){
                            text = "";
                        }
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new CoordinatesTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;
                    case LayerType.MAP_COORDINATES_LAYER_TYPE:
                        var text:string;
                        try{
                            text= layerData.childNodes[0].nodeValue;
                        }
                        catch(error){
                            text = "";
                        }
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new MapCoordinatesTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;
                    case LayerType.DATE_TIME_LAYER_TYPE:
                        var text:string;
                        try{
                            text= layerData.childNodes[0].nodeValue;
                        }
                        catch(error){
                            text = "";
                        }
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var fontWeight:string = layerData.getAttribute("fontWeight");
                        var textAlign:string = layerData.getAttribute("text-align");

                        templateLayer = new DateTimeTemplateLayer(id, aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
                        layers.add(templateLayer);
                        break;
                    case LayerType.IMAGE_LAYER_TYPE:
                        var url:string = layerData.getAttribute("url");
                        templateLayer = new ImageTemplateLayer(id, aspectRatio, type, url, left, top, right, bottom, changeable);
                        layers.add(templateLayer);
                        break;
                    case LayerType.BORDER_CIRCLE_LAYER_TYPE:
                        var radius:string = layerData.getAttribute("radius");
                        var radiusColor:string = layerData.getAttribute("color");
                        var radiusWidth:string = layerData.getAttribute("width");
                        var border:string = layerData.getAttribute("border");
                        
                        templateLayer = new BorderCircleTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, radius, radiusWidth, radiusColor, border);
                        layers.add(templateLayer);
                        break;
                    case LayerType.STARMAP_LAYER_TYPE:
                        var starsColor:string = layerData.getAttribute("starsColor");
                        var backgroundColor:string = layerData.getAttribute("backgroundColor");
                        var constellationColor:string = layerData.getAttribute("constellationColor");
                        var borderColor:string = layerData.getAttribute("borderColor");
                        var borderWeight:number = parseFloat(layerData.getAttribute("borderWeight"));

                        templateLayer = new StarmapLayerModel(id, aspectRatio, type, left, top, right, bottom, changeable, starsColor, backgroundColor, constellationColor, borderColor, borderWeight);
                        new StarmapLayerController((templateLayer as StarmapLayerModel));
                        layers.add(templateLayer);

                        break;

                    case LayerType.MAP_LAYER_TYPE:
                        var normalStyle:string = layerData.getAttribute("normalStyle");
                        var noStreetLabelsStyle:string = layerData.getAttribute("noStreeLabelsStyle");
                        
                        var zoom:string = layerData.getAttribute("zoom");
                        var border:string = layerData.getAttribute("border");
                        var lat:string = layerData.getAttribute("lat");
                        var lng:string = layerData.getAttribute("lng");
                        var position:string[] = [lng, lat];

                        if(left == null && right == null && top == null && bottom == null){
                            left = "0";
                            right = "0";
                            top = "0";
                            bottom = "0";
                        }
                        
                        templateLayer = new MapLayerModel(id, aspectRatio, type, left, top, right, bottom, border, changeable, zoom, [noStreetLabelsStyle, normalStyle], position);
                        new MapLayerController((templateLayer as MapLayerModel));
                        layers.add(templateLayer);

                        break;
                    case LayerType.LABELS_CONTAINER:
                        var backgroundColor:string = layerData.getAttribute("backgroundColor");
                        var backgroundAlpha:string = layerData.getAttribute("backgroundAlpha");

                        if(left == null && right == null && top == null && bottom == null){
                            left = "0";
                            right = "0";
                            top = "0";
                            bottom = "0";
                        }
                        
                        templateLayer = new LabelsContainerTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border);
                        layers.add(templateLayer);
                        break;
                }
            }

            var template:Template = new Template(name, preview, width, height, layers, aspectRatio);
            collection.add(template);
        }
        
        return collection;
    }
    
    private parseStyles(stylesString:string):string[]{
        console.log("stylesString=",stylesString);
        var stylesObj:any = JSON.parse(stylesString);
        //return [stylesObj.normal, stylesObj.noStreetLabels];
        return ["",""]
    }
}
