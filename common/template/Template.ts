///<reference path="layer/TemplateLayer.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/geographicMap/MapLayerModel.ts"/>
class Template{
    private width:number;
    private height:number;
    private name:string;
    private preview:string;
    private aspectRatio:any;
    
    private layers:List<TemplateLayer>;
    private city:string;
    private lat:string;
    private lng:string;
    
    private mapParameters:any;
    
    public static ON_SELECT:string = "ON_SELECT";

    constructor(name:string, preview:string, width:number, height:number, layers:List<TemplateLayer>, aspectRatio:any){
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    
    public setMapParameters(parameters:any):void{
        this.mapParameters = parameters;
        var layersIterator:ListIterator = this.getLayersIterator();
        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            if(layer.getType() == LayerType.MAP_LAYER_TYPE){
                (layer as MapLayerModel).setCurrentMapParameters(parameters);
            }
        }
    }
    
    public setCity(city:string):void{
        this.city = city;
    }

    public setLat(lat:string):void{
        this.lat = lat;
    }
    public setLng(lng:string):void{
        this.lng = lng;
    }
    public getCity():string{
        return this.city;
    }
    public getLat():string{
        return this.lat;
    }
    public getLng():string{
        return this.lng;
    }
    
    public getPreview():string{
        return this.preview;
    }
    
    public getLayersIterator():ListIterator{
        return this.layers.getIterator();
    }
    
    public getPrintWidth():number{
        return this.width;
    }
    public getPrintHeight():number{
        return this.height;
    }
    
    public getAspectRatio():string{
        return this.aspectRatio;
    }
}
