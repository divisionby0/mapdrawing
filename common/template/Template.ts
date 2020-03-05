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
    
    public getName():string{
        return this.name;
    }
    public setName(name:string):void{
        this.name = name;
    }
    
    public addLayer(layer:TemplateLayer):void{
        this.layers.add(layer);
    }
    
    
    /*
    public setMapParameters(parameters:any):void{
        this.mapParameters = parameters;
    }
    */
    
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
    public setPrintWidth(width:number):void{
        this.width = width;
    }
    
    public getPrintHeight():number{
        return this.height;
    }
    public setPrintHeight(height:number):void{
        this.height = height;
    }

    public getAspectRatio():string{
        return this.aspectRatio;
    }
    public setAspectRatio(ar:any):void{
        this.aspectRatio = ar;
    }
}
