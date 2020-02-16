///<reference path="Template.ts"/>
///<reference path="layer/DivTemplateLayer.ts"/>
///<reference path="layer/TextTemplateLayer.ts"/>
///<reference path="layer/ImageTemplateLayer.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/BorderCircleTemplateLayer.ts"/>
///<reference path="layer/StarmapTemplateLayer.ts"/>
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
            //console.log("templateData:", templateData);

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
                var type:string = layerData.getAttribute("type");
                var left:string = layerData.getAttribute("left");
                var top:string = layerData.getAttribute("top");
                var right:string = layerData.getAttribute("right");
                var bottom:string = layerData.getAttribute("bottom");
                var changeable:any = layerData.getAttribute("changeable");

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
                        var border:string = layerData.getAttribute("border");
                        
                        if(left == null && right == null && top == null && bottom == null){
                            left = "0";
                            right = "0";
                            top = "0";
                            bottom = "0";
                        }
                        templateLayer = new DivTemplateLayer(aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border);
                        layers.add(templateLayer);
                        break;
                    case LayerType.TEXT_LAYER_TYPE:
                        var text:string = layerData.childNodes[0].nodeValue;
                        var textColor:string = layerData.getAttribute("color");
                        var fontSize:string = layerData.getAttribute("size");
                        var textAlign:string = layerData.getAttribute("text-align");
                        
                        templateLayer = new TextTemplateLayer(aspectRatio, type, text, textColor, fontSize, left, top, right, bottom, changeable, textAlign);
                        layers.add(templateLayer);
                        break;
                    case LayerType.IMAGE_LAYER_TYPE:
                        var url:string = layerData.getAttribute("url");
                        templateLayer = new ImageTemplateLayer(aspectRatio, type, url, left, top, right, bottom, changeable);
                        layers.add(templateLayer);
                        break;
                    case LayerType.BORDER_CIRCLE_LAYER_TYPE:
                        var radius:string = layerData.getAttribute("radius");
                        var radiusColor:string = layerData.getAttribute("color");
                        var radiusWidth:string = layerData.getAttribute("width");
                        var border:string = layerData.getAttribute("border");
                        
                        templateLayer = new BorderCircleTemplateLayer(aspectRatio, type, left, top, right, bottom, changeable, radius, radiusWidth, radiusColor, border);
                        layers.add(templateLayer);
                        break;
                    case LayerType.STARMAP_LAYER_TYPE:
                        var starsColor:string = layerData.getAttribute("starsColor");
                        var backgroundColor:string = layerData.getAttribute("backgroundColor");
                        
                        templateLayer = new StarmapTemplateLayer(aspectRatio, type, left, top, right, bottom, changeable, starsColor, backgroundColor);
                        layers.add(templateLayer);
                        break;
                }
            }

            var template:Template = new Template(name, preview, width, height, layers, aspectRatio);
            collection.add(template);
        }
        
        return collection;
    }
    
    private onXmlElement():void{

    }
}
