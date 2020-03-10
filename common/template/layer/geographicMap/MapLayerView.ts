///<reference path="../../element/LayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
///<reference path="../../../../printmap/js/geographicMap/GeographicMap.ts"/>
///<reference path="MapLayerModel.ts"/>
///<reference path="../../../lib/Utils.ts"/>
class MapLayerView extends LayerView{

    private map:GeographicMap;
    private left:any = 0;
    private right:any = 0;
    private top:any = 0;
    private bottom:any = 0;
    
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
        
        var params:MapParameters = (layer as MapLayerModel).getMapParameters();
        params.setContainer(this.selfId);

        var border:string = (this.layer as MapLayerModel).getBorder();
        if(border){
            border = Utils.updateBorderString(border, this.coeff);
            this.style+="border:"+border+";";
        }

        this.layerContainer = this.j$("<div id='"+this.selfId+"' style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        
        this.map = new GeographicMap(this.j$, params, this.layer.getLeft(), this.layer.getRight(), this.layer.getTop(), this.layer.getBottom());
        this.onResize();
    }

    
    public setMapStyle(style:string):void{
        if(this.map){
            this.map.setStyle(style);
        }
    }
    public setPosition(position:any):void{
        if(this.map){
            this.map.setPosition(position);
        }
    }
    
    protected onResize():void{
        super.onResize();
        
        if(this.layerContainer){
            this.left = this.layerContainer.width()/100 * parseInt(this.layer.getLeft());
            this.right = this.layerContainer.width()/100 * parseInt(this.layer.getRight());
            
            // TODO какая-то путаница с border в расчетах - разобраться
            this.top = 0;
            this.bottom = 0;

            if(this.layer.hasTop()){
                this.top = this.currentHeight / 100 * parseInt(this.layer.getTop());
            }
            if(this.layer.hasBottom()){
                this.bottom = this.currentHeight / 100 * parseInt(this.layer.getBottom());
            }
            
            this.layerContainer.css({"left":this.left});
            this.layerContainer.css({"right":this.right});
            this.layerContainer.css({"top":this.top});
            this.layerContainer.css({"bottom":this.bottom});

            var layerWidth:number;
            var layerHeight:number;
            
            if(this.coeff==1){
                layerWidth = (this.currentWidth - this.left - this.right)*this.coeff;
                layerHeight = (this.currentHeight - this.top - this.bottom)*this.coeff;
            }
            else{
                layerWidth = 2481;
                layerHeight = 3509;
            }
            
            //var layerWidth:number = (this.currentWidth - left - right)*this.coeff;
            //var layerHeight:number = (this.currentHeight - top - bottom)*this.coeff;
            
            this.layerContainer.width(layerWidth);
            this.layerContainer.height(layerHeight);
            
            if(this.map){
                this.map.resize(layerWidth, layerHeight);
            }
        }
    }
}
