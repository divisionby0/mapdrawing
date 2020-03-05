///<reference path="MapLayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
class MapLayerModel extends TemplateLayer{
    private mapStyle:string;
    private styles:string[] = new Array();
    private border:string;
    private placeLabelsVisible:boolean = false;
    
    private currentMapParameters:MapParameters;

    constructor(id:string, aspectRatio:number, type:string, left:any, top:any, right:any, bottom:any, border:string, changeable:boolean, zoom:string, styles:string[], position:any[], bounds:any){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        
        this.styles = styles;
        this.border = border;
        console.log("Model create parameters zoom="+zoom);
        this.currentMapParameters = new MapParameters(this.styles[0], parseFloat(zoom), position, bounds, 0, 0);
    }
    
    public getZoom():any{
        return this.currentMapParameters.getZoom();
    }
    
    public getCenter():any{
        return this.currentMapParameters.getCenter();
    }
    
    public getMapParameters():MapParameters{
        return this.currentMapParameters;
    }
    
    public coordinatesChanged(data:any):void{
        var center:any = data.center;
        var zoom:any = data.zoom;
        var bounds:any = data.bounds;

        this.currentMapParameters.setCenter(center);
        this.currentMapParameters.setZoom(zoom);
        this.currentMapParameters.setBounds(bounds);
    }
    
    public locationChanged(coord:any[]):void{
        this.currentMapParameters.setCenter(coord);
        
        if(this.view){
            (this.view as MapLayerView).setPosition(this.currentMapParameters.getCenter());
        }
        else{
            console.error("View not set yet. Cannot apply new position.");
        }
    }
    
    public placeLabelsVisibilityChanged(visible:boolean):void{
        this.placeLabelsVisible = visible;
        if(visible){
            this.mapStyle = this.styles[1];
        }
        else{
            this.mapStyle = this.styles[0];
        }
        if(this.view){
            (this.view as MapLayerView).setMapStyle(this.mapStyle);
        }
    }
    public getBorder():string{
        return this.border;
    }
    
    public getMapStyle():string{
        return this.mapStyle;
    }
}
