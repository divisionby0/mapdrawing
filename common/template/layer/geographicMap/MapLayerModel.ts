///<reference path="MapLayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
class MapLayerModel extends TemplateLayer{
    
    private zoom:string;
    private position:any[];
    private mapStyle:string;
    private styles:string[] = new Array();
    private border:string;

    constructor(id:string, aspectRatio:number, type:string, left:any, top:any, right:any, bottom:any, border:string, changeable:boolean, zoom:string, styles:string[], position:any[]){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        this.border = border;
        this.zoom = zoom;
        this.styles = styles;
        this.position = position;
        
        this.mapStyle = this.styles[0];
    }
    
    public setView(view:LayerView):void{
        super.setView(view);
        
        console.log("setView this.position=",this.position);
        (this.view as MapLayerView).setZoom(this.zoom);
        (this.view as MapLayerView).setPosition(this.position);
        (this.view as MapLayerView).setMapStyle(this.mapStyle);
    }
    
    public locationChanged(coord:any[]):void{
        this.position = coord;
        if(this.view){
            (this.view as MapLayerView).setPosition(this.position);
        }
        else{
            console.error("View not set yet. Cannot apply new position.");
        }
    }
    
    public getBorder():string{
        return this.border;
    }
    public getZoom():string{
        return this.zoom;
    }
    public getPosition():any[]{
        return this.position;
    }
    public getMapStyle():string{
        return this.mapStyle;
    }
}
