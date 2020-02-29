///<reference path="../../element/LayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
///<reference path="../../../../printmap/js/geographicMap/GeographicMap.ts"/>
///<reference path="MapLayerModel.ts"/>
///<reference path="../../../lib/Utils.ts"/>
class MapLayerView extends LayerView{

    private map:GeographicMap;
    private zoom:string;
    private position:string[];
    private mapStyle:string;
    private mapParameters:any;
    
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number, zoom:string, mapStyle:string, position:string[]){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
        this.zoom = zoom;
        this.position = position;
        this.mapStyle = mapStyle;
        
        this.createMap();
    }
    
    public setZoom(zoom:string):void{
        if(this.map){
            this.map.setZoom(zoom);
        }
    }
    public setMapStyle(style:string):void{
        if(this.map){
            this.map.setStyle(style);
        }
    }
    public setPosition(position:any):void{
        this.position = position;
        if(this.map){
            this.map.setPosition(position);
        }
    }
    
    protected onResize():void{
        super.onResize();
        
        if(this.layerContainer){
            var left:any = this.layerContainer.width()/100 * parseInt(this.layer.getLeft());
            var right:any = this.layerContainer.width()/100 * parseInt(this.layer.getRight());
            
            // TODO какая-то путаница с border в расчетах - разобраться
            var top:any = 0;
            var bottom:any = 0;

            if(this.layer.hasTop()){
                top = this.currentHeight / 100 * parseInt(this.layer.getTop());
            }
            if(this.layer.hasBottom()){
                bottom = this.currentHeight / 100 * parseInt(this.layer.getBottom());
            }
            
            this.layerContainer.css({"left":left});
            this.layerContainer.css({"right":right});
            this.layerContainer.css({"top":top});
            this.layerContainer.css({"bottom":bottom});

            this.layerContainer.width(this.currentWidth - left - right);
            this.layerContainer.height(this.currentHeight - top - bottom);

            this.map.resize(this.layerContainer.width(), this.layerContainer.height());
        }
    }
    
    
    protected create():void{
        // do nothing
    }

    private createMap() {
        
        var parameters:any = {zoom:this.zoom, position:this.position, style:this.mapStyle, coeff:this.coeff};
        
        if(this.mapParameters){
            if(this.mapParameters.bounds){
                parameters.bounds = this.mapParameters.bounds;
            }
            if(this.mapParameters.pitch){
                parameters.pitch = this.mapParameters.pitch;
            }
            if(this.mapParameters.bearing){
                parameters.bearing = this.mapParameters.bearing;
            }
        }
        else{
            console.log("no map parameters provided");
        }

        console.log("create map parameters=",parameters);
        
        var border:string = (this.layer as MapLayerModel).getBorder();
        if(border){
            border = Utils.updateBorderString(border, this.coeff);
            this.style+="border:"+border+";";
        }

        this.layerContainer = this.j$("<div id='"+this.selfId+"' style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        
        this.map = new GeographicMap(this.j$, this.selfId, parameters);
        this.onResize();
    }
}
